import { cn } from "@/lib/utils";
import { PaceAvatar } from "./PaceAvatar";
import { Lightbulb } from "lucide-react";
import { ReactNode } from "react";
import { VerificationChecklist, VerificationData } from "./VerificationChecklist";

export interface Message {
  id: string;
  type: "assistant" | "user";
  content: string;
  timestamp: Date;
  helperText?: string;
  verificationData?: VerificationData;
}

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
  children?: ReactNode;
}

export const ChatMessage = ({ message, isLatest, children }: ChatMessageProps) => {
  const isAssistant = message.type === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isAssistant ? "justify-start" : "justify-end"
      )}
      style={{ animationDelay: isLatest ? "0ms" : "0ms" }}
    >
      {isAssistant && <PaceAvatar className="flex-shrink-0 mt-1" />}

      <div className={cn(
        "space-y-2",
        isAssistant ? "w-full max-w-xl" : "max-w-[85%] flex flex-col items-end"
      )}>
        {isAssistant && (
          <span className="text-sm font-semibold text-foreground pl-1">Pace</span>
        )}
        <div
          className={cn(
            "px-5 py-4 w-full",
            isAssistant
              ? "chat-bubble-assistant shadow-sm"
              : "chat-bubble-user"
          )}
        >
          {message.content && (
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          )}

          {message.verificationData && (
            <VerificationChecklist data={message.verificationData} />
          )}

          {message.helperText && isAssistant && (
            <div className="mt-4 pt-4 border-t border-border/30 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground italic">
                {message.helperText}
              </p>
            </div>
          )}

          {children && isAssistant && (
            <div className="mt-5 pt-4 border-t border-border/30">
              {children}
            </div>
          )}
        </div>

        <span className="text-xs text-muted-foreground px-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};
