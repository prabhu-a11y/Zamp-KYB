import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
import { OnboardingData } from "@/hooks/useOnboardingFlow";

import { HelpChat } from "./HelpChat";

interface ProductRecommendationScreenProps {
  data: OnboardingData;
  onConfirm: (selectedProducts: string[]) => void;
  contextData?: any; // Already has 'data', but matching pattern
  stepInfo?: string;
}

interface Product {
  key: string;
  label: string;
  description: string;
}

const ALL_PRODUCTS: Product[] = [
  { key: "local_transfers", label: "Local transfers", description: "Included with all Wio accounts." },
  { key: "international_transfers", label: "International transfers", description: "Send money abroad easily." },
  { key: "multiuser_access", label: "Multiuser & team access", description: "Give your team access to manage finances." },
  { key: "payment_gateway", label: "Online payment gateway", description: "Accept payments on your website." },
  { key: "pos_terminals", label: "Point of Sale terminals", description: "Accept in-person card payments." },
  { key: "salary_payments", label: "Salary payments", description: "Process payroll for your team." },
  { key: "credit_card", label: "Credit card", description: "A business credit card for company expenses." },
  { key: "business_loan", label: "Business loan", description: "Financing to grow your business." },
  { key: "supply_chain", label: "Supply chain finance", description: "Manage supplier payments with flexible terms." },
  { key: "invoice_management", label: "Invoice management", description: "Create and track invoices." },
];

const RETAIL_KEYWORDS = [
  "retail", "shop", "store", "trading", "supermarket", "grocery",
  "restaurant", "café", "cafe", "coffee", "food", "beverage", "f&b",
  "catering", "bakery", "pharmacy", "salon", "spa", "fitness", "gym"
];

const TURNOVER_VALUES = [
  "Less than AED 100,000",
  "AED 100,000 - 500,000",
  "AED 500,000 - 1 million",
  "AED 1 million - 5 million",
  "AED 5 million - 10 million",
  "More than AED 10 million",
];

export function ProductRecommendationScreen({ data, onConfirm, contextData, stepInfo }: ProductRecommendationScreenProps) {
  const containsRetailKeywords = (activities: string): boolean => {
    const lowerActivities = activities.toLowerCase();
    return RETAIL_KEYWORDS.some(keyword => lowerActivities.includes(keyword));
  };

  const getTurnoverIndex = (turnover: string): number => {
    return TURNOVER_VALUES.findIndex(v => v === turnover);
  };

  const preselectedProducts = useMemo(() => {
    const selected: string[] = ["local_transfers"]; // Always included

    // International transfers
    if (data.hasInternationalOps) {
      selected.push("international_transfers");
    }

    // Multiuser access
    const legalType = data.tradeLicense.legalType;
    if (data.shareholders.length > 1 || ["partnership", "llc", "fzco", "fze"].includes(legalType || "")) {
      selected.push("multiuser_access");
    }

    // Online payment gateway
    if (data.hasOnlinePresence) {
      selected.push("payment_gateway");
    }

    // POS terminals
    const activities = data.tradeLicense.activities || data.freelancerPermit.activity || "";
    if (data.hasPhysicalAddressUAE && containsRetailKeywords(activities)) {
      selected.push("pos_terminals");
    }

    // Salary payments
    const turnoverIndex = getTurnoverIndex(data.annualTurnover);
    if (["partnership", "llc", "fzco", "fze"].includes(legalType || "") && turnoverIndex >= 3) {
      selected.push("salary_payments");
    }

    return selected;
  }, [data]);

  const preselectionReasons = useMemo(() => {
    const reasons: Record<string, string> = {
      local_transfers: "Included with all Wio accounts.",
    };

    if (data.hasInternationalOps && data.operatingCountries.length > 0) {
      reasons.international_transfers = `You mentioned operating in ${data.operatingCountries.join(", ")}.`;
    } else if (data.hasInternationalOps) {
      reasons.international_transfers = "You mentioned operating internationally.";
    }

    if (data.shareholders.length > 1) {
      reasons.multiuser_access = "Your company has multiple shareholders, so you'll likely need team access.";
    } else if (["partnership", "llc", "fzco", "fze"].includes(data.tradeLicense.legalType || "")) {
      reasons.multiuser_access = "Your company structure may benefit from team access.";
    }

    if (data.hasOnlinePresence) {
      reasons.payment_gateway = "You have a website, so you may want to accept payments online.";
    }

    const activities = data.tradeLicense.activities || data.freelancerPermit.activity || "";
    if (data.hasPhysicalAddressUAE && containsRetailKeywords(activities)) {
      reasons.pos_terminals = "You have a physical location, so you may need to accept in-person payments.";
    }

    const legalType = data.tradeLicense.legalType;
    const turnoverIndex = getTurnoverIndex(data.annualTurnover);
    if (["partnership", "llc", "fzco", "fze"].includes(legalType || "") && turnoverIndex >= 3) {
      reasons.salary_payments = "As a growing business, you may need to process payroll.";
    }

    return reasons;
  }, [data]);

  const [selectedProducts, setSelectedProducts] = useState<string[]>(preselectedProducts);

  const optionalProducts = ALL_PRODUCTS.filter(
    p => !preselectedProducts.includes(p.key) && p.key !== "local_transfers"
  );

  const toggleProduct = (key: string) => {
    if (key === "local_transfers") return; // Always included
    setSelectedProducts(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const getProductByKey = (key: string) => ALL_PRODUCTS.find(p => p.key === key);

  const [isHelpOpen, setIsHelpOpen] = useState(false);

  if (isHelpOpen) {
    return (
      <HelpChat
        contextData={contextData}
        stepInfo={stepInfo || "Product Selection"}
        isOpen={true}
        onToggle={setIsHelpOpen}
      />
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Pre-selected products */}
      <div
        className="bg-card border border-border rounded-xl p-5 space-y-4"
        style={{ boxShadow: 'var(--extraction-shadow)' }}
      >
        <h3 className="text-lg font-semibold">Recommended for you</h3>
        <div className="grid grid-cols-2 gap-3">
          {preselectedProducts.map(key => {
            const product = getProductByKey(key);
            if (!product) return null;
            const isLocalTransfers = key === "local_transfers";
            const isSelected = selectedProducts.includes(key);

            return (
              <div
                key={key}
                className={`flex items-start gap-2 p-3 bg-muted/30 rounded-lg ${isLocalTransfers ? "" : "cursor-pointer hover:bg-muted/50 transition-colors"
                  }`}
                onClick={() => !isLocalTransfers && toggleProduct(key)}
              >
                {isLocalTransfers ? (
                  <div className="mt-0.5 shrink-0">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                ) : (
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleProduct(key)}
                    className="mt-0.5 shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{product.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {preselectionReasons[key] || product.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional add-ons */}
      {optionalProducts.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-base font-medium text-muted-foreground">You might also be interested in:</h3>
          <div className="grid grid-cols-2 gap-3">
            {optionalProducts.map(product => (
              <div
                key={product.key}
                className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleProduct(product.key)}
              >
                <Checkbox
                  checked={selectedProducts.includes(product.key)}
                  onCheckedChange={() => toggleProduct(product.key)}
                  className="mt-0.5 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{product.label}</div>
                  <div className="text-xs text-muted-foreground">{product.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button onClick={() => onConfirm(selectedProducts)} size="lg" className="w-full text-base">
        Confirm & Continue
      </Button>
      <HelpChat
        contextData={contextData || data}
        stepInfo={stepInfo || "Product Selection"}
        isOpen={false}
        onToggle={setIsHelpOpen}
      />
    </div>
  );
}
