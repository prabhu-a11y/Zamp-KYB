import { useState, useCallback } from "react";

export type ScreenId =
  | "0.1"
  | "1.1" | "1.2" | "1.3" | "1.4" | "1.5" | "1.6" | "1.7" | "1.8"
  | "2.1" | "2.2"
  | "3.1" | "3.2" | "3.3" | "3.4" | "3.5" | "3.5-QA" | "3.6" | "3.7"
  | "4.1" | "4.2" | "4.3" | "4.4" | "4.5" | "4.6"
  | "5.1" | "5.2" | "5.2A" | "5.3" | "5.4" | "5.5" | "5.6" | "5.7" | "5.7A" | "5.8" | "5.8A"
  | "6.1" | "6.2" | "6.3" | "6.4" | "6.5" | "6.6" | "6.7" | "6.8"
  | "7.1" | "7.2" | "7.3";

export interface OnboardingData {
  // Step 1: Identity
  fullName: string;
  email: string;
  phone: string;
  password: string;
  emiratesId: {
    file?: File;
    fullName: string;
    idNumber: string;
    nationality: string;
    dateOfBirth: string;
    expiryDate: string;
  };

  // Step 2: Business Type
  businessType: "trade_license" | "freelancer" | null;
  restrictedIndustryConfirmed: boolean;

  // Step 3: Documents
  tradeLicense: {
    file?: File;
    businessName: string;
    licenseNumber: string;
    issuingAuthority: string;
    legalType: "sole_proprietorship" | "partnership" | "llc" | "fzco" | "fze" | null;
    activities: string;
    expiryDate: string;
  };
  freelancerPermit: {
    file?: File;
    fullName: string;
    permitNumber: string;
    issuingAuthority: string;
    activity: string;
    expiryDate: string;
  };
  shareholders: Array<{
    name: string;
    nationality: string;
    ownership: string;
  }>;

  // Step 4: Authorization
  isShareholderMatch: boolean;
  requiresPOA: boolean;
  requiresBankMandate: boolean;
  poa: {
    file?: File;
    grantedBy: string;
    grantedTo: string;
    scope: string;
    dateIssued: string;
    expiryDate: string;
    notarized: boolean;
  };
  bankMandate?: File;
  proofOfAddress?: File;

  // Step 5: Business Details
  hasOnlinePresence: boolean | null;
  websiteUrl: string;
  hasInternationalOps: boolean | null;
  operatingCountries: string[];
  hasPhysicalPresenceAbroad: boolean | null;
  hasPhysicalAddressUAE: boolean | null;
  businessAddress: string;
  addressMapUrl?: string;
  addressVideoPath?: string;
  websiteVideoPath?: string;
  extractedWebsiteData?: any;
  leiCode: string;
  extractedLEIData?: any;
  leiVideoPath?: string;

  // Step 6: Financial Profile
  annualTurnover: string;
  sourcesOfFunds: string[];
  otherFundSource: string;
  monthlyDeposits: string;
  monthlyWithdrawals: string;
  cashDepositPercentage: number;
  cashWithdrawalPercentage: number;

  // Verification Statuses
  addressVerificationStatus?: "Verified" | "Manual" | null;

  // Step 6B: Product Recommendations
  selectedProducts: string[];

  // Step 6C: Plan Recommendation
  selectedPlan: "essential" | "grow" | null;
}

const initialData: OnboardingData = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  emiratesId: {
    fullName: "",
    idNumber: "",
    nationality: "",
    dateOfBirth: "",
    expiryDate: "",
  },
  businessType: null,
  restrictedIndustryConfirmed: false,
  tradeLicense: {
    businessName: "",
    licenseNumber: "",
    issuingAuthority: "",
    legalType: null,
    activities: "",
    expiryDate: "",
  },
  freelancerPermit: {
    fullName: "",
    permitNumber: "",
    issuingAuthority: "",
    activity: "",
    expiryDate: "",
  },
  shareholders: [],
  isShareholderMatch: true,
  requiresPOA: false,
  requiresBankMandate: false,
  poa: {
    grantedBy: "",
    grantedTo: "",
    scope: "",
    dateIssued: "",
    expiryDate: "",
    notarized: false,
  },
  hasOnlinePresence: null,
  websiteUrl: "",
  hasInternationalOps: null,
  operatingCountries: [],
  hasPhysicalPresenceAbroad: null,
  hasPhysicalAddressUAE: null,
  businessAddress: "",
  leiCode: "",
  annualTurnover: "",
  sourcesOfFunds: [],
  otherFundSource: "",
  monthlyDeposits: "",
  monthlyWithdrawals: "",
  cashDepositPercentage: 0,
  cashWithdrawalPercentage: 0,
  addressVerificationStatus: null,
  selectedProducts: [],
  selectedPlan: null,
};

// Dummy extracted data for demo
export const DUMMY_EMIRATES_ID = {
  fullName: "Ahmed Mohammed Al Rashid",
  idNumber: "784-1990-1234567-1",
  nationality: "United Arab Emirates",
  dateOfBirth: "15/03/1990",
  expiryDate: "14/03/2030",
};

export const DUMMY_TRADE_LICENSE = {
  businessName: "Al Rashid Trading LLC",
  licenseNumber: "TL-2024-123456",
  issuingAuthority: "Dubai Economic Department",
  legalType: "llc" as const,
  activities: "General Trading, Import & Export",
  expiryDate: "31/12/2025",
};

export const DUMMY_TRADE_LICENSE_SOLE = {
  businessName: "Ahmed Rashid Electronics",
  licenseNumber: "456",
  issuingAuthority: "Dubai Economic Department",
  legalType: "sole_proprietorship" as const,
  activities: "Electronics Retail & Repair",
  expiryDate: "31/12/2025",
};

export const DUMMY_FREELANCER_PERMIT = {
  fullName: "Ahmed Mohammed Al Rashid",
  permitNumber: "FP-2024-789012",
  issuingAuthority: "Dubai Creative Clusters Authority",
  activity: "IT Consulting Services",
  expiryDate: "31/12/2025",
};

export const DUMMY_SHAREHOLDERS = [
  { name: "Ahmed Mohammed Al Rashid", nationality: "UAE", ownership: "60%" },
  { name: "Fatima Hassan Al Maktoum", nationality: "UAE", ownership: "40%" },
];

export const DUMMY_POA = {
  grantedBy: "Ahmed Mohammed Al Rashid",
  grantedTo: "John Smith",
  scope: "Full Banking Authority",
  dateIssued: "01/01/2024",
  expiryDate: "31/12/2025",
  notarized: true,
};

export function getStepFromScreen(screenId: ScreenId): number {
  const prefix = screenId.split(".")[0];
  return parseInt(prefix);
}

export function useOnboardingFlow() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("0.1");
  const [data, setData] = useState<OnboardingData>(initialData);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [screenHistory, setScreenHistory] = useState<ScreenId[]>([]);

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const getNextScreenWithData = useCallback((current: ScreenId, currentData: OnboardingData): ScreenId => {
    switch (current) {
      // Step 0 flow
      case "0.1": return "1.1";

      // Step 1 flow
      case "1.1": return "1.2";
      case "1.2": return "1.3";
      case "1.3": return "1.4";
      case "1.4": return "1.5";
      case "1.5": return "1.7"; // Skip 1.6 (Password)
      case "1.6": return "1.7";
      case "1.7": return "1.8";
      case "1.8": return "2.1";

      // Step 2 flow
      case "2.1": return "2.2";
      case "2.2":
        return currentData.businessType === "trade_license" ? "3.1" : "3.3";

      // Step 3 flow
      case "3.1": return "3.2";
      case "3.2": {
        const legalType = currentData.tradeLicense.legalType;
        if (legalType === "sole_proprietorship") {
          return currentData.isShareholderMatch ? "4.1" : "4.2";
        }
        if (legalType === "partnership") return "3.6";
        if (["llc", "fzco", "fze"].includes(legalType || "")) return "3.5";
        return "4.1";
      }
      case "3.3": return "3.4";
      case "3.4": return "4.1";
      case "3.5": return "3.7";
      case "3.5-QA": return "3.6"; // After Q&A, go to shareholders (3.6)
      case "3.6": return "3.7";
      case "3.7":
        return currentData.isShareholderMatch ? "4.1" : "4.2";

      // Step 4 flow
      case "4.1":
        return currentData.requiresBankMandate ? "4.5" : "4.6";
      case "4.2": return "4.3";
      case "4.3": return "4.4";
      case "4.4":
        return currentData.requiresBankMandate ? "4.5" : "4.6";
      case "4.5": return "4.6";
      case "4.6": return "5.1";

      // Step 5 flow
      case "5.1":
        return currentData.hasOnlinePresence ? "5.2" : "5.3";
      case "5.2": return "5.2A";
      case "5.2A": return "5.8"; // Website -> LEI

      // NEW FLOW: LEI -> Address -> International Ops -> Financial
      case "5.8": return "5.8A";
      case "5.8A": return "5.7"; // LEI -> Address Check
      case "5.7": return "5.3";  // Address -> International Ops (MultiAddress)
      case "5.3": return "6.1";  // International Ops -> Financial (End of Business flow)

      // Skip old steps 5.4, 5.5, 5.6 as they are replaced by 5.3 MultiAddressInput
      case "5.4": return "6.1";
      case "5.5": return "6.1";
      case "5.6": return "6.1";
      case "5.7A": return "5.3"; // Fallback if 5.7A is reached via some path, redirect to 5.3

      // Step 6 flow
      case "6.1": return "6.2";
      case "6.2": return "6.3";
      case "6.3": return "6.4";
      case "6.4": return "6.5";
      case "6.5": return "6.6";
      case "6.6": return "6.7";
      case "6.7": return "6.8";
      case "6.8": return "7.1";

      // Step 7 flow
      case "7.1": return "7.2";
      case "7.2": return "7.3";

      default: return current;
    }
  }, []);

  const goToNextScreen = useCallback((overrideData?: Partial<OnboardingData>) => {
    const mergedData = overrideData ? { ...data, ...overrideData } : data;
    const nextScreen = getNextScreenWithData(currentScreen, mergedData);
    const currentStep = getStepFromScreen(currentScreen);
    const nextStep = getStepFromScreen(nextScreen);

    // Track history for back navigation
    setScreenHistory(prev => [...prev, currentScreen]);

    if (nextStep > currentStep && !completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }

    setCurrentScreen(nextScreen);
  }, [currentScreen, data, completedSteps, getNextScreenWithData]);

  const goToPreviousScreen = useCallback(() => {
    if (screenHistory.length === 0) return false;
    const previousScreen = screenHistory[screenHistory.length - 1];
    setScreenHistory(prev => prev.slice(0, -1));
    setCurrentScreen(previousScreen);
    return true;
  }, [screenHistory]);

  const canGoBack = screenHistory.length > 0;

  const currentStep = getStepFromScreen(currentScreen);

  return {
    currentScreen,
    currentStep,
    data,
    updateData,
    goToNextScreen,
    goToPreviousScreen,
    canGoBack,
    completedSteps,
    setCurrentScreen,
  };
}
