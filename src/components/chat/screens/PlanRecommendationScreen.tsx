import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { OnboardingData } from "@/hooks/useOnboardingFlow";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PlanRecommendationScreenProps {
  data: OnboardingData;
  onConfirm: (plan: "essential" | "grow") => void;
  contextData?: any;
  stepInfo?: string;
}

interface Plan {
  id: "essential" | "grow";
  name: string;
  price: string;
  tagline: string;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: "essential",
    name: "Essential Plan",
    price: "AED 99/month",
    tagline: "For solo operators, freelancers, and startups just getting started.",
    features: [
      "Local transfers included",
      "1 user access",
      "Basic analytics dashboard",
      "Email support",
    ],
  },
  {
    id: "grow",
    name: "Grow Plan",
    price: "AED 249/month",
    tagline: "For growing businesses that need more from their banking.",
    features: [
      "Local & international transfers",
      "Unlimited team members",
      "Advanced analytics & reporting",
      "Priority support",
      "Salary payments integration",
      "Multi-signatory approvals",
    ],
  },
];

const TURNOVER_VALUES = [
  "Less than AED 100,000",
  "AED 100,000 - 500,000",
  "AED 500,000 - 1 million",
  "AED 1 million - 5 million",
  "AED 5 million - 10 million",
  "More than AED 10 million",
];

import { HelpChat } from "./HelpChat";

export function PlanRecommendationScreen({ data, onConfirm, contextData, stepInfo }: PlanRecommendationScreenProps) {
  const getTurnoverIndex = (turnover: string): number => {
    return TURNOVER_VALUES.findIndex(v => v === turnover);
  };

  const recommendedPlanId = useMemo((): "essential" | "grow" => {
    // Check if salary_payments is in selected products
    if (data.selectedProducts.includes("salary_payments")) return "grow";

    // Check shareholder count
    if (data.shareholders.length > 1) return "grow";

    // Check legal type
    const legalType = data.tradeLicense.legalType;
    if (["partnership", "llc", "fzco", "fze"].includes(legalType || "")) return "grow";

    // Check turnover index (>= 3 means AED 1M+)
    if (getTurnoverIndex(data.annualTurnover) >= 3) return "grow";

    return "essential";
  }, [data]);

  const [selectedPlan, setSelectedPlan] = useState<"essential" | "grow">(recommendedPlanId);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const justificationSummary = useMemo(() => {
    const bullets: string[] = [];

    // Business type
    if (data.businessType === "freelancer") {
      bullets.push(`Freelancer: ${data.freelancerPermit.fullName || "Self-employed"}`);
    } else {
      const legalTypeLabels: Record<string, string> = {
        sole_proprietorship: "Sole Proprietorship",
        partnership: "Partnership",
        llc: "LLC",
        fzco: "FZCO",
        fze: "FZE",
      };
      const legalLabel = legalTypeLabels[data.tradeLicense.legalType || ""] || "Business";
      bullets.push(`${legalLabel}: ${data.tradeLicense.businessName || "Your company"}`);
    }

    // Shareholder status
    if (data.businessType === "freelancer") {
      bullets.push("Sole permit holder");
    } else if (data.shareholders.length > 1) {
      bullets.push(`${data.shareholders.length} shareholders`);
    } else if (data.shareholders.length === 1) {
      bullets.push("Sole owner");
    }

    // Salary payments need
    if (data.selectedProducts.includes("salary_payments")) {
      bullets.push("Salary payments needed");
    }

    // International operations
    if (data.hasInternationalOps && data.operatingCountries.length > 0) {
      bullets.push(`International: ${data.operatingCountries.join(", ")}`);
    } else if (data.hasInternationalOps) {
      bullets.push("International operations");
    }

    // Annual turnover
    if (data.annualTurnover) {
      bullets.push(`Turnover: ${data.annualTurnover}`);
    }

    // Online presence
    if (data.hasOnlinePresence && data.websiteUrl) {
      bullets.push(`Website: ${data.websiteUrl}`);
    }

    // Physical address
    if (data.hasPhysicalAddressUAE && data.businessAddress) {
      bullets.push(`UAE address: ${data.businessAddress}`);
    }

    return bullets;
  }, [data]);

  const recommendedPlan = PLANS.find(p => p.id === recommendedPlanId)!;
  const alternatePlan = PLANS.find(p => p.id !== recommendedPlanId)!;

  const PlanCard = ({ plan, isRecommended, isSelected, onClick }: {
    plan: Plan;
    isRecommended: boolean;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <div
      className={`bg-card border rounded-xl p-5 space-y-4 cursor-pointer transition-all ${isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
        }`}
      style={isRecommended ? { boxShadow: 'var(--extraction-shadow)' } : undefined}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            {isRecommended && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Recommended
              </span>
            )}
          </div>
          <p className="text-xl font-bold mt-1">{plan.price}</p>
          <p className="text-sm text-muted-foreground mt-1">{plan.tagline}</p>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? "border-primary bg-primary" : "border-muted-foreground"
          }`}>
          {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (isHelpOpen) {
    return (
      <HelpChat
        contextData={contextData}
        stepInfo={stepInfo || "Plan Selection"}
        isOpen={true}
        onToggle={setIsHelpOpen}
      />
    );
  }

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Justification summary */}
      <div className="bg-muted/50 border border-border rounded-xl p-4">
        <p className="text-sm font-medium mb-3">Based on your profile:</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {justificationSummary.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span className="truncate">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended plan */}
      <PlanCard
        plan={recommendedPlan}
        isRecommended={true}
        isSelected={selectedPlan === recommendedPlan.id}
        onClick={() => setSelectedPlan(recommendedPlan.id)}
      />

      {/* Alternative plan in accordion */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="alternate" className="border-0">
          <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline py-2">
            Not quite right? See other options
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <PlanCard
              plan={alternatePlan}
              isRecommended={false}
              isSelected={selectedPlan === alternatePlan.id}
              onClick={() => setSelectedPlan(alternatePlan.id)}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button onClick={() => onConfirm(selectedPlan)} size="lg" className="w-full text-base">
        Continue with {selectedPlan === "essential" ? "Essential" : "Grow"} Plan
      </Button>
      <HelpChat
        contextData={contextData || data}
        stepInfo={stepInfo || "Plan Selection"}
        isOpen={false}
        onToggle={setIsHelpOpen}
      />
    </div>
  );
}
