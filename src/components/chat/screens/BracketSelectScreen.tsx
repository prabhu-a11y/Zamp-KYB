import { OptionCard } from "../OptionCard";

interface Option {
  value: string;
  label: string;
}

import { useState } from "react";
import { HelpChat } from "./HelpChat";

interface BracketSelectScreenProps {
  options: Option[];
  onSelect: (value: string) => void;
  contextData?: any;
  stepInfo?: string;
}

export function BracketSelectScreen({ options, onSelect, contextData, stepInfo }: BracketSelectScreenProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  if (isHelpOpen) {
    return (
      <HelpChat
        contextData={contextData}
        stepInfo={stepInfo || "Selection Step"}
        isOpen={true}
        onToggle={setIsHelpOpen}
      />
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className="w-full text-left px-5 py-4 bg-card border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-base"
          >
            {option.label}
          </button>
        ))}
      </div>
      <HelpChat
        contextData={contextData}
        stepInfo={stepInfo || "Selection Step"}
        isOpen={false}
        onToggle={setIsHelpOpen}
      />
    </div>
  );
}
