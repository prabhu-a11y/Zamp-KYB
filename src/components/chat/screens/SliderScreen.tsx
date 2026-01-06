import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { HelpChat } from "./HelpChat";

interface SliderScreenProps {
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  onSubmit: (value: number) => void;
  contextData?: any;
  stepInfo?: string;
}

export function SliderScreen({ min = 0, max = 100, step = 1, suffix = "%", onSubmit, contextData, stepInfo }: SliderScreenProps) {
  const [value, setValue] = useState([0]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleSubmit = () => {
    onSubmit(value[0]);
  };

  if (isHelpOpen) {
    return (
      <HelpChat
        contextData={contextData}
        stepInfo={stepInfo || "Percentage Selection"}
        isOpen={true}
        onToggle={setIsHelpOpen}
      />
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="space-y-5">
        <div className="bg-card border border-border rounded-xl p-8">
          <div className="text-center mb-8">
            <span className="text-5xl font-bold text-primary">{value[0]}{suffix}</span>
          </div>
          <Slider
            value={value}
            onValueChange={setValue}
            min={min}
            max={max}
            step={step}
            className="w-full"
          />
          <div className="flex justify-between mt-3 text-sm text-muted-foreground">
            <span>{min}{suffix}</span>
            <span>{max}{suffix}</span>
          </div>
        </div>
        <Button onClick={handleSubmit} size="lg" className="w-full text-base">
          Continue
        </Button>
      </div>
      <HelpChat
        contextData={contextData}
        stepInfo={stepInfo || "Percentage Selection"}
        isOpen={false}
        onToggle={setIsHelpOpen}
      />
    </div>
  );
}
