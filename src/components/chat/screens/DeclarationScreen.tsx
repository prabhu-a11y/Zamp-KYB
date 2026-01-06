import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface DeclarationScreenProps {
  onSubmit: () => void;
  contextData?: any;
  stepInfo?: string;
}

const DECLARATIONS = [
  "All information provided is accurate and complete",
  "All documents uploaded are genuine and unaltered",
  "I am authorized to open this account on behalf of the business",
  "I agree to the Terms of Service and Privacy Policy",
];

import { HelpChat } from "./HelpChat";

export function DeclarationScreen({ onSubmit, contextData, stepInfo }: DeclarationScreenProps) {
  const [agreed, setAgreed] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  if (isHelpOpen) {
    return (
      <HelpChat
        contextData={contextData}
        stepInfo={stepInfo || "Declaration"}
        isOpen={true}
        onToggle={setIsHelpOpen}
      />
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <p className="text-base text-muted-foreground">
          By submitting this application, I confirm that:
        </p>

        <ul className="space-y-4">
          {DECLARATIONS.map((declaration, index) => (
            <li key={index} className="text-base flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              {declaration}
            </li>
          ))}
        </ul>

        <div className="flex items-start gap-4 pt-3 border-t border-border">
          <Checkbox
            id="agree"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked as boolean)}
            className="w-5 h-5 mt-0.5"
          />
          <label htmlFor="agree" className="text-base cursor-pointer">
            I have read and agree to the above declarations
          </label>
        </div>

        <Button onClick={onSubmit} disabled={!agreed} size="lg" className="w-full text-base">
          Submit Application
        </Button>
      </div>
      <HelpChat
        contextData={contextData}
        stepInfo={stepInfo || "Declaration"}
        isOpen={false}
        onToggle={setIsHelpOpen}
      />
    </div>
  );
}
