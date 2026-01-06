import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { HelpChat } from "./HelpChat";

interface RestrictedIndustriesModalProps {
  onConfirm: () => void;
  onBack?: () => void;
  contextData?: any;
  stepInfo?: string;
}

const RESTRICTED_INDUSTRIES = [
  "Jewelry and precious metals trading",
  "Cryptocurrency and virtual assets",
  "Money exchange and remittance",
  "Gambling and gaming",
  "Weapons and ammunition",
  "Adult entertainment",
];

export function RestrictedIndustriesModal({ onConfirm, onBack, contextData, stepInfo }: RestrictedIndustriesModalProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  if (isHelpOpen) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <HelpChat isOpen={true} onToggle={() => setIsHelpOpen(false)} contextData={contextData} stepInfo={stepInfo} />
      </div>
    );
  }

  // Animate in after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(onConfirm, 300);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Backdrop with blur */}
      <div
        className={cn(
          "absolute inset-0 bg-background/80 backdrop-blur-sm transition-all duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Modal content */}
      <div
        className={cn(
          "relative bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl transition-all duration-300",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
        )}

        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="p-3 bg-warning/10 rounded-xl flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-warning" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              Before we continue...
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              We're unable to open accounts for businesses in the following industries:
            </p>
          </div>
        </div>

        {/* Restricted industries list */}
        <div className="bg-muted/50 rounded-xl p-4 mb-5">
          <ul className="space-y-2.5">
            {RESTRICTED_INDUSTRIES.map((industry) => (
              <li key={industry} className="text-sm flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-destructive flex-shrink-0" />
                <span className="text-foreground">{industry}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Confirmation checkbox */}
        <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl mb-5 border border-primary/10">
          <Checkbox
            id="confirm-restricted"
            checked={confirmed}
            onCheckedChange={(checked) => setConfirmed(checked as boolean)}
            className="mt-0.5"
          />
          <label
            htmlFor="confirm-restricted"
            className="text-sm cursor-pointer text-foreground leading-relaxed"
          >
            I confirm my business is <span className="font-medium">not</span> involved in any of the above industries
          </label>
        </div>

        {/* Action button */}
        <Button
          onClick={handleConfirm}
          disabled={!confirmed}
          size="lg"
          className="w-full text-base"
        >
          Continue
        </Button>
      </div>
      <div className="absolute bottom-4 right-4 z-50">
        <HelpChat isOpen={false} onToggle={() => setIsHelpOpen(true)} contextData={contextData} stepInfo={stepInfo} />
      </div>
    </div>
  );
}
