import { Button } from "@/components/ui/button";
import { Check, Pencil } from "lucide-react";
import { OnboardingData } from "@/hooks/useOnboardingFlow";

interface ReviewScreenProps {
  data: OnboardingData;
  onContinue: () => void;
  contextData?: any;
  stepInfo?: string;
}

import { HelpChat } from "./HelpChat";

export function ReviewScreen({ data, onContinue, contextData, stepInfo }: ReviewScreenProps) {
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-base">{title}</h4>
        <button className="text-primary text-sm flex items-center gap-1.5">
          <Pencil className="h-4 w-4" /> Edit
        </button>
      </div>
      <div className="space-y-2 text-base">{children}</div>
    </div>
  );

  const Item = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );

  const DocItem = ({ label }: { label: string }) => (
    <div className="flex items-center gap-2.5 text-base">
      <Check className="h-5 w-5 text-green-500" />
      <span>{label}</span>
    </div>
  );

  const formatLegalType = (type: string | null) => {
    const types: Record<string, string> = {
      sole_proprietorship: "Sole Proprietorship",
      partnership: "Partnership",
      llc: "LLC",
      fzco: "FZCO",
      fze: "FZE",
    };
    return type ? types[type] || type : "N/A";
  };

  const formatProductName = (key: string) => {
    const products: Record<string, string> = {
      local_transfers: "Local transfers",
      international_transfers: "International transfers",
      multiuser_access: "Multiuser & team access",
      payment_gateway: "Online payment gateway",
      pos_terminals: "Point of Sale terminals",
      salary_payments: "Salary payments",
      credit_card: "Credit card",
      business_loan: "Business loan",
      supply_chain: "Supply chain finance",
      invoice_management: "Invoice management",
    };
    return products[key] || key;
  };

  return (
    <div className="animate-slide-up">
      <div className="bg-card border border-border rounded-xl p-6 space-y-6 max-h-[450px] overflow-y-auto">
        <Section title="Identity">
          <Item label="Name" value={data.fullName} />
          <Item label="Email" value={data.email} />
          <Item label="Phone" value={data.phone} />
          <Item label="Emirates ID" value={data.emiratesId.idNumber} />
        </Section>

        <Section title="Business">
          <Item label="Type" value={data.businessType === "trade_license" ? "Trade License" : "Freelancer"} />
          <Item
            label="Company Name"
            value={data.businessType === "trade_license" ? data.tradeLicense.businessName : data.freelancerPermit.fullName}
          />
          <Item
            label="License Number"
            value={data.businessType === "trade_license" ? data.tradeLicense.licenseNumber : data.freelancerPermit.permitNumber}
          />
          {data.businessType === "trade_license" && (
            <Item label="Entity Type" value={formatLegalType(data.tradeLicense.legalType)} />
          )}
        </Section>

        <Section title="Authorization">
          <Item
            label="Your Role"
            value={data.isShareholderMatch ? (data.shareholders.length > 0 ? `Shareholder (${data.shareholders[0]?.ownership})` : "Owner") : "Authorized Representative"}
          />
        </Section>

        <Section title="Business Details">
          <Item label="Website" value={data.websiteUrl || "None"} />
          <Item label="International Operations" value={data.hasInternationalOps ? `Yes - ${data.operatingCountries.join(", ")}` : "No"} />
          <Item label="UAE Address" value={data.businessAddress || "None"} />
        </Section>

        <Section title="Financial Profile">
          <Item label="Annual Turnover" value={data.annualTurnover} />
          <Item label="Monthly Deposits" value={data.monthlyDeposits} />
          <Item label="Monthly Withdrawals" value={data.monthlyWithdrawals} />
          <Item label="Cash Deposits" value={`${data.cashDepositPercentage}%`} />
          <Item label="Cash Withdrawals" value={`${data.cashWithdrawalPercentage}%`} />
        </Section>

        {data.selectedProducts && data.selectedProducts.length > 0 && (
          <Section title="Selected Products & Services">
            {data.selectedProducts.map(product => (
              <DocItem key={product} label={formatProductName(product)} />
            ))}
          </Section>
        )}

        {data.selectedPlan && (
          <Section title="Selected Plan">
            <Item
              label="Plan"
              value={data.selectedPlan === "essential" ? "Essential Plan" : "Grow Plan"}
            />
            <Item
              label="Monthly Price"
              value={data.selectedPlan === "essential" ? "AED 99" : "AED 249"}
            />
          </Section>
        )}

        <Section title="Documents">
          <DocItem label="Emirates ID" />
          <DocItem label={data.businessType === "trade_license" ? "Trade License" : "Freelancer Permit"} />
          {data.shareholders.length > 0 && <DocItem label="MOA / Partnership Deed" />}
          {data.requiresPOA && <DocItem label="Power of Attorney" />}
          {data.requiresBankMandate && <DocItem label="Bank Mandate" />}
          <DocItem label="Proof of Address" />
        </Section>
      </div>

      <Button onClick={onContinue} size="lg" className="w-full mt-5 text-base">
        Continue to Declaration
      </Button>
      <HelpChat contextData={contextData || data} stepInfo={stepInfo || "Final Review"} />
    </div>
  );
}
