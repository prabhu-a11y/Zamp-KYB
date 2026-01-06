import { useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput = ({
  onSend,
  placeholder = "Type your message...",
  disabled = false,
}: ChatInputProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full px-4 py-3 pr-12 rounded-lg border border-input bg-card",
          "text-sm placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-all duration-200"
        )}
      />
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2",
          "w-8 h-8 rounded-md flex items-center justify-center",
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90 transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
};
