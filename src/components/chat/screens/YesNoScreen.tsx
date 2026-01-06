import { OptionCard } from "../OptionCard";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { HelpChat } from "./HelpChat";

interface YesNoScreenProps {
  onSelect: (value: boolean) => void;
  contextData?: any;
  stepInfo?: string;
  question?: string;
}

export function YesNoScreen({ onSelect, contextData, stepInfo, question }: YesNoScreenProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  if (isHelpOpen) {
    return <HelpChat isOpen={true} onToggle={() => setIsHelpOpen(false)} contextData={contextData} stepInfo={stepInfo} />;
  }

  return (
    <div className="space-y-4 animate-slide-up relative">
      {question && (
        <div className="text-sm font-medium text-foreground px-1">{question}</div>
      )}
      <div className="flex gap-3">
        <OptionCard
          icon={Check}
          label="Yes"
          onClick={() => onSelect(true)}
        />
        <OptionCard
          icon={X}
          label="No"
          onClick={() => onSelect(false)}
        />
      </div>
      <HelpChat isOpen={false} onToggle={() => setIsHelpOpen(true)} contextData={contextData} stepInfo={stepInfo} />
    </div>
  );
}
