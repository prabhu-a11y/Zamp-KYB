import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { OnboardingData } from "@/hooks/useOnboardingFlow";

export interface Step {
  id: number;
  label: string;
  description?: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  data?: OnboardingData;
}

interface StepDataItem {
  label: string;
  value: string;
  isExtracted?: boolean;
}

const getStepData = (stepId: number, data: OnboardingData): StepDataItem[] => {
  switch (stepId) {
    case 1:
      return [
        data.fullName && { label: "Full Name", value: data.fullName, isExtracted: true },
        data.email && { label: "Email", value: data.email },
        data.phone && { label: "Phone", value: data.phone },
        data.emiratesId.idNumber && { label: "Emirates ID", value: data.emiratesId.idNumber, isExtracted: true },
        data.emiratesId.nationality && { label: "Nationality", value: data.emiratesId.nationality, isExtracted: true },
      ].filter(Boolean) as StepDataItem[];
    
    case 2:
      return [
        data.businessType && { 
          label: "Business Type", 
          value: data.businessType === "trade_license" ? "Trade License Holder" : "Freelancer" 
        },
        data.restrictedIndustryConfirmed && { label: "Restricted Industries", value: "Not applicable" },
      ].filter(Boolean) as StepDataItem[];
    
    case 3:
      if (data.businessType === "trade_license" && data.tradeLicense.businessName) {
        return [
          { label: "Business Name", value: data.tradeLicense.businessName, isExtracted: true },
          data.tradeLicense.licenseNumber && { label: "License Number", value: data.tradeLicense.licenseNumber, isExtracted: true },
          data.tradeLicense.legalType && { 
            label: "Legal Type", 
            value: data.tradeLicense.legalType.toUpperCase(), 
            isExtracted: true 
          },
          data.tradeLicense.activities && { label: "Activities", value: data.tradeLicense.activities, isExtracted: true },
          data.shareholders.length > 0 && { 
            label: "Shareholders", 
            value: `${data.shareholders.length} shareholder(s)`,
            isExtracted: true 
          },
        ].filter(Boolean) as StepDataItem[];
      }
      if (data.businessType === "freelancer" && data.freelancerPermit.fullName) {
        return [
          { label: "Permit Holder", value: data.freelancerPermit.fullName, isExtracted: true },
          data.freelancerPermit.permitNumber && { label: "Permit Number", value: data.freelancerPermit.permitNumber, isExtracted: true },
          data.freelancerPermit.activity && { label: "Activity", value: data.freelancerPermit.activity, isExtracted: true },
        ].filter(Boolean) as StepDataItem[];
      }
      return [];
    
    case 4:
      return [
        { label: "Shareholder Match", value: data.isShareholderMatch ? "Verified" : "Not matched" },
        data.requiresPOA && { label: "POA", value: data.poa.grantedBy ? "Uploaded" : "Required" },
        data.requiresBankMandate && { label: "Bank Mandate", value: data.bankMandate ? "Uploaded" : "Required" },
        data.proofOfAddress && { label: "Proof of Address", value: "Uploaded" },
      ].filter(Boolean) as StepDataItem[];
    
    case 5:
      return [
        data.hasOnlinePresence !== null && { 
          label: "Online Presence", 
          value: data.hasOnlinePresence ? "Yes" : "No" 
        },
        data.websiteUrl && { label: "Website", value: data.websiteUrl },
        data.hasInternationalOps !== null && { 
          label: "International Operations", 
          value: data.hasInternationalOps ? "Yes" : "No" 
        },
        data.operatingCountries.length > 0 && { 
          label: "Operating Countries", 
          value: data.operatingCountries.join(", ") 
        },
        data.hasPhysicalAddressUAE !== null && { 
          label: "UAE Address", 
          value: data.hasPhysicalAddressUAE ? "Yes" : "No" 
        },
        data.businessAddress && { label: "Business Address", value: data.businessAddress },
      ].filter(Boolean) as StepDataItem[];
    
    case 6:
      return [
        data.annualTurnover && { label: "Annual Turnover", value: data.annualTurnover },
        data.sourcesOfFunds.length > 0 && { label: "Sources of Funds", value: data.sourcesOfFunds.join(", ") },
        data.monthlyDeposits && { label: "Monthly Deposits", value: data.monthlyDeposits },
        data.monthlyWithdrawals && { label: "Monthly Withdrawals", value: data.monthlyWithdrawals },
        data.selectedProducts.length > 0 && { 
          label: "Selected Products", 
          value: `${data.selectedProducts.length} product(s)` 
        },
        data.selectedPlan && { 
          label: "Selected Plan", 
          value: data.selectedPlan === "essential" ? "Essential Plan" : "Grow Plan" 
        },
      ].filter(Boolean) as StepDataItem[];
    
    case 7:
      return [];
    
    default:
      return [];
  }
};

export const ProgressStepper = ({
  steps,
  currentStep,
  completedSteps,
  data,
}: ProgressStepperProps) => {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);

  const toggleStep = (stepId: number) => {
    if (!data) return;
    const stepData = getStepData(stepId, data);
    if (stepData.length === 0) return;
    
    setExpandedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  return (
    <div className="space-y-1">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = currentStep === step.id;
        const isPending = !isCompleted && !isCurrent;
        const isExpanded = expandedSteps.includes(step.id);
        const stepData = data ? getStepData(step.id, data) : [];
        const hasData = stepData.length > 0;
        const isClickable = hasData && (isCompleted || isCurrent);

        return (
          <div key={step.id}>
            <div 
              className={cn(
                "flex items-start gap-3 rounded-lg transition-all duration-200",
                isClickable && "cursor-pointer hover:bg-muted/50 -mx-2 px-2 py-1"
              )}
              onClick={() => isClickable && toggleStep(step.id)}
            >
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    isCompleted && "bg-success text-success-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    isPending && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                {/* Connector line */}
                {index < steps.length - 1 && !isExpanded && (
                  <div
                    className={cn(
                      "w-0.5 h-8 my-1 transition-colors duration-300",
                      isCompleted ? "bg-success" : "bg-border"
                    )}
                  />
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 pt-1 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium transition-colors",
                        isCurrent && "text-foreground",
                        isCompleted && "text-success",
                        isPending && "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </p>
                    {step.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.description}
                      </p>
                    )}
                  </div>
                  {isClickable && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {stepData.length}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded data cards */}
            {isExpanded && hasData && (
              <div className="ml-11 mb-3 space-y-2 animate-slide-up">
                {stepData.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-card border border-border rounded-lg p-3"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {item.label}
                      </span>
                      {item.isExtracted && (
                        <Sparkles className="w-3 h-3 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-foreground font-medium truncate">
                      {item.value}
                    </p>
                  </div>
                ))}
                {/* Connector line after expanded content */}
                {index < steps.length - 1 && (
                  <div className="flex justify-start -ml-[34px] mt-2">
                    <div
                      className={cn(
                        "w-0.5 h-6 transition-colors duration-300",
                        isCompleted ? "bg-success" : "bg-border"
                      )}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
