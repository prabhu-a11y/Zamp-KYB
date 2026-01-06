import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { HelpChat } from "./HelpChat";

interface TextInputScreenProps {
  placeholder?: string;
  type?: "text" | "email" | "tel" | "url";
  prefix?: string;
  onSubmit: (value: string) => void;
  // Dynamic Help Context
  contextData?: any;
  stepInfo?: string;
  initialValue?: string;
}

export function TextInputScreen({ placeholder, type = "text", prefix, onSubmit, contextData, stepInfo, initialValue }: TextInputScreenProps) {
  const [value, setValue] = useState(initialValue || "");
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Validation Logic
  const checkValidity = (val: string) => {
    if (!val.trim()) return false;
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(val.trim());
    }
    if (type === "tel") {
      // Dubai/UAE Mobile Validation: Starts with 05, 10 digits total
      const mobileRegex = /^05\d{8}$/;
      return mobileRegex.test(val.trim());
    }
    return true; // Simple text is valid if not empty
  };

  const isValid = checkValidity(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(prefix ? `${prefix}${value}` : value);
    }
  };

  // ... (HelpChat logic remains same)

  if (isHelpOpen) {
    return (
      <HelpChat
        contextData={contextData}
        stepInfo={stepInfo || "Input Step"}
        isOpen={true}
        onToggle={setIsHelpOpen}
      />
    );
  }

  return (
    <div className="animate-slide-up">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          {prefix && (
            <div className="flex items-center px-4 bg-muted rounded-lg text-muted-foreground text-base">
              {prefix}
            </div>
          )}
          <Input
            type={type}
            value={value}
            onChange={(e) => {
              const val = e.target.value;
              // Enforce numeric only for tel and max length 10
              setValue(type === "tel" ? val.replace(/\D/g, "").slice(0, 10) : val);
            }}
            placeholder={placeholder}
            className="flex-1 h-12 text-base px-4"
          />
          <Button type="submit" size="lg" disabled={!isValid} className="px-6 transition-opacity duration-200">
            Submit
          </Button>
        </div>
      </form>

      {/* Help Chat handles its own button rendering when closed */}
      <HelpChat
        contextData={contextData}
        stepInfo={stepInfo || "Input Step"}
        isOpen={false}
        onToggle={setIsHelpOpen}
      />
    </div>
  );
}
