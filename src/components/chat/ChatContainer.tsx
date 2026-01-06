import { useRef, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChatContainerProps {
  children: ReactNode;
  className?: string;
}

export const ChatContainer = ({ children, className }: ChatContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex-1 overflow-y-auto px-8 py-8 space-y-6",
        "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
        className
      )}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {children}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
