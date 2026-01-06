import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface Option {
  value: string;
  label: string;
  hasOther?: boolean;
}

import { HelpChat } from "./HelpChat";

interface MultiSelectScreenProps {
  options: Option[];
  onSubmit: (selected: string[], otherValue?: string) => void;
  contextData?: any;
  stepInfo?: string;
}

export function MultiSelectScreen({ options, onSubmit, contextData, stepInfo }: MultiSelectScreenProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [otherValue, setOtherValue] = useState("");

  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const toggleOption = (value: string) => {
    setSelected(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = () => {
    if (selected.length > 0) {
      onSubmit(selected, selected.includes("other") ? otherValue : undefined);
    }
  };

  if (isHelpOpen) {
    return (
      <HelpChat
        contextData={contextData}
        stepInfo={stepInfo || "Multi-Selection Step"}
        isOpen={true}
        onToggle={setIsHelpOpen}
      />
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          {options.map((option) => (
            <div key={option.value}>
              <div className="flex items-center gap-4">
                <Checkbox
                  id={option.value}
                  checked={selected.includes(option.value)}
                  onCheckedChange={() => toggleOption(option.value)}
                  className="w-5 h-5"
                />
                <label htmlFor={option.value} className="text-base cursor-pointer flex-1">
                  {option.label}
                </label>
              </div>
              {option.hasOther && selected.includes(option.value) && (
                <Input
                  value={otherValue}
                  onChange={(e) => setOtherValue(e.target.value)}
                  placeholder="Please specify..."
                  className="mt-3 ml-9 h-12 text-base"
                />
              )}
            </div>
          ))}
        </div>
        <Button onClick={handleSubmit} disabled={selected.length === 0} size="lg" className="w-full text-base">
          Continue
        </Button>
      </div>
      <HelpChat
        contextData={contextData}
        stepInfo={stepInfo || "Multi-Selection Step"}
        isOpen={false}
        onToggle={setIsHelpOpen}
      />
    </div>
  );
}
