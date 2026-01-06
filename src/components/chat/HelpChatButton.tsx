import { useState, useEffect } from "react";
import { HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HelpChatWindow } from "./HelpChatWindow";
import { ScreenId, OnboardingData } from "@/hooks/useOnboardingFlow";
import { buildContextSummary } from "@/utils/screenContext";

interface HelpChatButtonProps {
  currentScreen?: ScreenId;
  data?: OnboardingData;
}

export const HelpChatButton = ({ currentScreen, data }: HelpChatButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contextSummary, setContextSummary] = useState<string>("");

  useEffect(() => {
    if (currentScreen && data) {
      setContextSummary(buildContextSummary(currentScreen, data));
    }
  }, [currentScreen, data]);

  return (
    <>
      <HelpChatWindow 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        screenContext={contextSummary}
      />
      
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 z-50",
          "h-12 w-12 rounded-full shadow-lg",
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          "transition-all duration-200",
          isOpen && "rotate-90"
        )}
        size="icon"
        aria-label={isOpen ? "Close help chat" : "Open help chat"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <HelpCircle className="h-5 w-5" />}
      </Button>
    </>
  );
};
