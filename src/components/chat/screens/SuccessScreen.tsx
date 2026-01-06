import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PartyPopper, Mail, Check, Send, Loader2, Paperclip } from "lucide-react";

interface SuccessScreenProps {
  email: string;
  referenceNumber: string;
  contextData?: any;
  stepInfo?: string;
  zampProcessId?: string | null;
}

import { HelpChat } from "./HelpChat";

const initialStatusSteps = [
  { label: "Application Submitted", completed: true },
  { label: "Under Review", completed: true },
  { label: "Application Approved", completed: false },
  { label: "Account Opened", completed: false },
];

export function SuccessScreen({ email, referenceNumber, contextData, stepInfo, zampProcessId }: SuccessScreenProps) {
  const [showStatus, setShowStatus] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Messaging & Status State
  const [messages, setMessages] = useState<any[]>([]);
  const [msgText, setMsgText] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false); // New uploading state
  const [processStatus, setProcessStatus] = useState("In Progress");
  const [statusSteps, setStatusSteps] = useState(initialStatusSteps);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  // Poll for messages and status
  useEffect(() => {
    if (!zampProcessId) return;

    const fetchData = async () => {
      try {
        // Fetch Messages
        const msgRes = await fetch(`/zamp/messages/${zampProcessId}`);
        if (msgRes.ok) {
          const data = await msgRes.json();
          setMessages(data.messages || []);
        }

        // Fetch Status
        const statusRes = await fetch(`/zamp/status/${zampProcessId}`);
        if (statusRes.ok) {
          const data = await statusRes.json();
          setProcessStatus(data.status);

          if (data.status === "Done" || data.status === "Complete" || data.status === "success") {
            setStatusSteps([
              { label: "Application Submitted", completed: true },
              { label: "Under Review", completed: true },
              { label: "Application Approved", completed: true },
              { label: "Account Opened", completed: true }, // Assuming fully done
            ]);
          }
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [zampProcessId]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (showStatus && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showStatus]);

  const handleSendMessage = async (textOverride?: string) => {
    const contentToSend = textOverride || msgText;
    if (!contentToSend.trim() || !zampProcessId) return;
    setSending(true);
    try {
      await fetch('/zamp/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          processId: zampProcessId,
          sender: "Applicant",
          content: contentToSend
        })
      });
      if (!textOverride) setMsgText("");
      // Messages will update on next poll
    } catch (e) {
      console.error(e);
    }
    setSending(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !zampProcessId) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/zamp/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const fileLink = `[FILE] ${file.name} (Uploaded)`;
        // Ideally we would send a proper link, but for now just text indicating upload.
        // Or if we want to include the path: `[FILE] ${file.name} (${data.path})`
        // Let's send a friendly message.
        await handleSendMessage(`Uploaded file: ${file.name}`);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (isHelpOpen) {
    return <HelpChat isOpen={true} onToggle={() => setIsHelpOpen(false)} contextData={contextData} stepInfo={stepInfo} />;
  }

  // Show Main Dashboard
  if (showStatus) {
    return (
      <div className="animate-slide-up">
        <div className="bg-card border border-border rounded-xl p-8 space-y-6">

          <div>
            <h3 className="text-2xl font-semibold">Application Status</h3>
            <p className="text-muted-foreground text-base mt-2">
              Track your onboarding progress in real-time
            </p>
          </div>

          {/* Status Tracker */}
          <div className="flex items-center justify-between py-6">
            {statusSteps.map((step, index) => (
              <div key={step.label} className="flex flex-col items-center flex-1">
                <div className="relative flex items-center w-full">
                  {/* Connecting line - left side */}
                  {index > 0 && (
                    <div
                      className={`absolute right-1/2 h-0.5 w-full ${statusSteps[index - 1].completed ? 'bg-primary' : 'bg-border'
                        }`}
                    />
                  )}

                  {/* Circle */}
                  <div className="relative z-10 mx-auto">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${step.completed
                        ? 'bg-green-500 border-green-500'
                        : 'bg-muted border-border'
                        }`}
                    >
                      {step.completed ? (
                        <Check className="h-6 w-6 text-white" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border-2 border-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Connecting line - right side */}
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`absolute left-1/2 h-0.5 w-full ${step.completed ? 'bg-primary' : 'bg-border'
                        }`}
                    />
                  )}
                </div>

                {/* Label */}
                <p
                  className={`text-sm mt-3 text-center font-medium ${step.completed ? 'text-green-500' : 'text-muted-foreground'
                    }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>

          {/* Chat / Message Interface */}
          {/* Only show if In Progress/Needs Review OR if there are messages */}
          <div className="bg-muted/30 rounded-xl border border-border overflow-hidden">
            <div className="p-4 bg-muted/50 border-b border-border">
              <h4 className="font-semibold text-sm">Communication with Pace Team</h4>
            </div>

            {messages.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                {processStatus === "Done" ? "Application process completed." : "No new messages. Our team is reviewing your application."}
              </div>
            )}

            {messages.length > 0 && (
              <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === "Applicant" ? "items-end" : "items-start"}`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs font-medium text-foreground">{msg.sender === "Applicant" ? "You" : "Pace"}</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <div className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] ${msg.sender === "Applicant"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-background border border-border text-foreground rounded-bl-none shadow-sm"
                      }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            )}

            {/* Input Area (Hide if Approved/Done) */}
            {processStatus !== "Done" && (
              <div className="p-3 border-t border-border bg-background flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={sending || uploading}
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach file"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <Paperclip className="h-4 w-4 text-muted-foreground" />}
                </Button>

                <input
                  className="flex-1 bg-transparent border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Type a message..."
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button size="icon" onClick={() => handleSendMessage()} disabled={sending || uploading}>
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            )}
            {processStatus === "Done" && (
              <div className="p-4 bg-green-50 text-green-700 text-sm text-center font-medium">
                Your application is approved! Check your email for login credentials.
              </div>
            )}
          </div>

          <div className="bg-muted rounded-xl p-5 space-y-3">
            <p className="text-base text-muted-foreground">Application Reference</p>
            <p className="font-mono font-bold text-xl">{referenceNumber}</p>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            You'll receive updates at <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
        <HelpChat isOpen={false} onToggle={() => setIsHelpOpen(true)} contextData={contextData} stepInfo={stepInfo} />
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="bg-card border border-border rounded-xl p-8 text-center space-y-5">
        <div className="flex justify-center">
          <div className="p-5 bg-green-500/10 rounded-full">
            <PartyPopper className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold">Application Submitted!</h3>
          <p className="text-muted-foreground text-base mt-2">
            Our team will review it within 2-3 business days.
          </p>
        </div>

        <div className="bg-muted rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-center gap-2 text-base text-muted-foreground">
            <Mail className="h-5 w-5" />
            <span>You'll receive updates at:</span>
          </div>
          <p className="font-medium text-lg">{email}</p>
        </div>

        <div className="pt-2">
          <p className="text-base text-muted-foreground">Application Reference</p>
          <p className="font-mono font-bold text-xl">{referenceNumber}</p>
        </div>

        <Button size="lg" className="w-full text-base" onClick={() => setShowStatus(true)}>
          Done
        </Button>
      </div>
      <HelpChat isOpen={false} onToggle={() => setIsHelpOpen(true)} contextData={contextData} stepInfo={stepInfo} />
    </div>
  );
}
