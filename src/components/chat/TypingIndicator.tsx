import { PaceAvatar } from "./PaceAvatar";

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 animate-fade-in">
      <PaceAvatar className="flex-shrink-0" />
      <div className="chat-bubble-assistant shadow-sm px-4 py-3">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-pulse-soft" />
          <div
            className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-pulse-soft"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-pulse-soft"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
};
