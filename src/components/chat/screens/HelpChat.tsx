import { useState, useRef, useEffect } from "react";
import { MessageCircle, ArrowLeft, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import paceLogo from "../../../assets/pace-logo.png";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface HelpChatProps {
    contextData: any;
    stepInfo?: string;
    onToggle?: (isOpen: boolean) => void;
    placeholder?: string;
    // If true, renders the full chat interface. If false, renders the toggle button.
    isOpen?: boolean;
}

export function HelpChat({ contextData, stepInfo = "Onboarding Process", onToggle, isOpen = false, placeholder = "Type your question..." }: HelpChatProps) {
    // If onToggle is not provided, we manage state internally (though for "replace" mode user likely manages it)
    const [internalOpen, setInternalOpen] = useState(false);
    const isChatOpen = onToggle ? isOpen : internalOpen;
    const setIsChatOpen = (val: boolean) => {
        if (onToggle) onToggle(val);
        else setInternalOpen(val);
    };

    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "I'm here to help! Ask me any question about the current step or the onboarding process."
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Reset messages when step changes? Maybe keep history? 
        // For now, let's keep history persistent within the component instance.
    }, [stepInfo]);

    useEffect(() => {
        if (isChatOpen) {
            scrollToBottom();
        }
    }, [messages, isChatOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setIsLoading(true);

        try {
            const response = await fetch("/chat/help", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: userMsg,
                    contextData,
                    stepInfo
                })
            });

            if (!response.ok) throw new Error("Failed to get response");

            const data = await response.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isChatOpen) {
        return (
            <div className="flex justify-center mt-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground gap-2 transition-colors"
                    onClick={() => setIsChatOpen(true)}
                >
                    <MessageCircle className="w-4 h-4" />
                    Need Help?
                </Button>
            </div>
        );
    }

    return (
        <div className="animate-slide-up mt-4 w-full">
            {/* Chat Container acting as "inline" message block */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">

                {/* Header / Assistant Identity */}
                <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/30">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                        <img src={paceLogo} alt="Pace Assistant" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <div className="font-semibold text-sm">Pace Assistant</div>
                        <div className="text-xs text-muted-foreground">Always here to help</div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user"
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-muted text-foreground rounded-bl-none"
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-muted rounded-2xl px-4 py-3 rounded-bl-none">
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border bg-background">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={placeholder}
                            className="w-full bg-muted/30 border-muted-foreground/20"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => setIsChatOpen(false)}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                disabled={!input.trim() || isLoading}
                            >
                                Continue
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
