import { Button } from "@/components/ui/button";
import { Check, Circle } from "lucide-react";
import { useState } from "react";
import { HelpChat } from "./HelpChat";

interface AuthorizationSummaryScreenProps {
  verifiedName: string;
  companyName: string;
  businessType: "trade_license" | "freelancer";
  legalType: string;
  ownershipPercentage?: string;
  isShareholderMatch: boolean;
  shareholderNames?: string[];
  shareholderCount?: number;
  requiresPOA: boolean;
  requiresBankMandate: boolean;
  onContinue: () => void;
  contextData?: any;
  stepInfo?: string;
}

export function AuthorizationSummaryScreen({
  verifiedName,
  companyName,
  businessType,
  legalType,
  ownershipPercentage,
  isShareholderMatch,
  shareholderNames = [],
  shareholderCount = 1,
  requiresPOA,
  requiresBankMandate,
  onContinue,
  contextData,
  stepInfo
}: AuthorizationSummaryScreenProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  if (isHelpOpen) {
    return <HelpChat isOpen={true} onToggle={() => setIsHelpOpen(false)} contextData={contextData} stepInfo={stepInfo} />;
  }
  const formatLegalType = (type: string, isFreelancer: boolean) => {
    if (isFreelancer) return "Freelancer Permit";
    const types: Record<string, string> = {
      sole_proprietorship: "Sole Proprietorship",
      partnership: "Partnership",
      llc: "Limited Liability Company (LLC)",
      fzco: "Free Zone Company (FZCO)",
      fze: "Free Zone Establishment (FZE)",
    };
    return types[type] || type;
  };

  const getRole = () => {
    if (businessType === "freelancer") return "the permit holder";
    if (legalType === "sole_proprietorship") return "the owner";
    if (["partnership", "llc", "fzco", "fze"].includes(legalType)) {
      return `a shareholder with ${ownershipPercentage || "N/A"} ownership`;
    }
    return "an authorized representative";
  };

  const getPOAReason = () => {
    if (!requiresPOA) {
      if (businessType === "freelancer") {
        return "You are the permit holder, so you have full authority over this account.";
      }
      if (legalType === "sole_proprietorship") {
        return "You're the owner of this business, so you have the authority to open this account.";
      }
      if (["partnership", "llc", "fzco", "fze"].includes(legalType)) {
        return "You're listed as a shareholder of this company, so you have the authority to open this account.";
      }
    }
    return `Since you're not a shareholder, we need a POA signed by one of the listed shareholders (${shareholderNames.join(", ")}) authorizing you to act on behalf of the company.`;
  };

  const getBankMandateReason = () => {
    if (!requiresBankMandate) {
      if (businessType === "freelancer") {
        return "As a freelancer, you are the sole operator of your business.";
      }
      if (legalType === "sole_proprietorship") {
        return "As the sole owner, you have full signing authority.";
      }
      if (shareholderCount === 1) {
        return "As the sole shareholder, you have full signing authority.";
      }
    }
    return "Since your company has multiple shareholders, we need a document that specifies who can operate the account and sign on its behalf.";
  };

  return (
    <div className="max-w-2xl animate-slide-up">
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        {/* Opening Statement */}
        <div className="space-y-3">
          <p className="text-base text-foreground">
            You are <span className="font-semibold">{verifiedName}</span>, {getRole()} at{" "}
            <span className="font-semibold">{companyName}</span>
            {businessType === "trade_license" && <>, which is a {formatLegalType(legalType, false)}</>}.
          </p>
          {!isShareholderMatch && (
            <p className="text-base text-muted-foreground">
              We noticed you're not listed as a shareholder of this company. That's okay — we'll just need some additional documents.
            </p>
          )}
        </div>

        {/* Document Requirements */}
        <div className="space-y-5 pt-4 border-t border-border">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {requiresPOA ? (
                <Circle className="h-5 w-5 text-primary" />
              ) : (
                <Check className="h-5 w-5 text-green-500" />
              )}
              <span className="font-medium text-base">
                Power of Attorney: {requiresPOA ? "Required" : "Not required"}
              </span>
            </div>
            <p className="text-base text-muted-foreground ml-8">{getPOAReason()}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {requiresBankMandate ? (
                <Circle className="h-5 w-5 text-primary" />
              ) : (
                <Check className="h-5 w-5 text-green-500" />
              )}
              <span className="font-medium text-base">
                Bank Mandate: {requiresBankMandate ? "Required" : "Not required"}
              </span>
            </div>
            <p className="text-base text-muted-foreground ml-8">{getBankMandateReason()}</p>
          </div>
        </div>

        <Button onClick={onContinue} size="lg" className="w-full text-base">
          Continue
        </Button>
      </div>
      <HelpChat isOpen={false} onToggle={() => setIsHelpOpen(true)} contextData={contextData} stepInfo={stepInfo} />
    </div>
  );
}
