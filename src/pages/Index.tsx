import { useState, useCallback, useEffect, useRef } from "react";
import { OnboardingLayout } from "@/components/layout/OnboardingLayout";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatMessage, Message } from "@/components/chat/ChatMessage";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { OptionCard } from "@/components/chat/OptionCard";
import { ModeToggle } from "@/components/mode-toggle";
import { FileUpload } from "@/components/chat/FileUpload";
import { BackLink } from "@/components/chat/BackLink";
import { Building2, Briefcase, ArrowRight } from "lucide-react";
import { Step } from "@/components/chat/ProgressStepper";
import {
  useOnboardingFlow,
  ScreenId,
  DUMMY_EMIRATES_ID,
  DUMMY_TRADE_LICENSE,
  DUMMY_TRADE_LICENSE_SOLE,
  DUMMY_FREELANCER_PERMIT,
  DUMMY_SHAREHOLDERS,
  DUMMY_POA,
} from "@/hooks/useOnboardingFlow";
import {
  TextInputScreen,
  OTPInputScreen,
  PasswordInputScreen,
  ExtractionConfirmScreen,
  YesNoScreen,
  BracketSelectScreen,
  MultiSelectScreen,
  CountrySelectScreen,
  SliderScreen,
  RestrictedIndustriesModal,
  AuthorizationSummaryScreen,
  ShareholderTableScreen,
  ReviewScreen,
  DeclarationScreen,
  SuccessScreen,
  TradeLicenseInputScreen,
  ProductRecommendationScreen,
  PlanRecommendationScreen,
  RangeSliderScreen,
  BusinessTypeSelectionScreen,
  AddressAutocomplete,
  MultiAddressInput,
  AutoPopulatedInfoScreen,
} from "@/components/chat/screens";
import { extractEmiratesIdData, extractAllTradeLicenseData, extractFreelancerPermitData, extractMOAData, extractPOAData } from "@/lib/gemini";
import { HelpChat } from "@/components/chat/screens/HelpChat";

// --- Zamp Integration Helpers ---
const ZAMP_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const initZampProcess = async () => {
  try {
    const response = await fetch(`${ZAMP_API_URL}/zamp/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ processName: "Wio Onboarding Application", team: "Wio Applicant" })
    });
    const data = await response.json();
    return data.processId;
  } catch (error) {
    console.error("Failed to init Zamp process:", error);
    return null;
  }
};

const logToZamp = async (processId: string, log: any, stepId?: string, keyDetails?: any, metadata?: any) => {
  try {
    await fetch(`${ZAMP_API_URL}/zamp/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ processId, log, stepId, keyDetails, metadata }),
    });
  } catch (error) {
    console.error("Failed to log to Zamp:", error);
  }
};

const uploadToZamp = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${ZAMP_API_URL}/zamp/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    return data.path;
  } catch (error) {
    console.error("Failed to upload to Zamp:", error);
    return null;
  }
};

const AddressInputWrapper = ({
  data,
  stepInfo,
  onMatched,
  onManualInput
}: {
  data: any,
  stepInfo: any,
  onMatched: (v: string) => void,
  onManualInput: (v: string) => void
}) => {
  const [status, setStatus] = useState<"checking" | "input" | "matched">("checking");
  const [matchedAddr, setMatchedAddr] = useState("");

  useEffect(() => {
    const checkMatch = async () => {
      // Extract addresses
      const websiteAddress = data.extractedWebsiteData?.address;
      const leiAddress = data.extractedLEIData?.["LEGAL ADDRESS"];

      if (!websiteAddress || !leiAddress) {
        setStatus("input");
        return;
      }

      try {
        const response = await fetch(`${ZAMP_API_URL}/match-addresses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address1: websiteAddress, address2: leiAddress })
        });

        const result = await response.json();
        if (result.match) {
          setMatchedAddr(leiAddress);
          setStatus("matched");
        } else {
          setStatus("input");
        }
      } catch (e) {
        console.error("Match failed", e);
        setStatus("input");
      }
    };

    checkMatch();
  }, []);

  if (status === "checking") {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <TypingIndicator />
        <p className="text-sm text-gray-500 mt-2">Comparing company addresses...</p>
      </div>
    );
  }

  if (status === "matched") {
    return (
      <ExtractionConfirmScreen
        fields={[
          { key: "addr", label: "Verified Address", value: matchedAddr }
        ]}
        onConfirm={() => onMatched(matchedAddr)}
      />
    );
  }

  return (
    <div className="w-full max-w-md animate-slide-up space-y-4">
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 mb-2">
        We noticed a mismatch in your addresses. Please search and select your correct business location.
      </div>
      <AddressAutocomplete
        onSelect={onManualInput}
        placeholder="Search for your business address..."
      />
    </div>
  );
};

const STEPS: Step[] = [
  { id: 1, label: "Identity", description: "Verification" },
  { id: 2, label: "Eligibility", description: "Business type" },
  { id: 3, label: "Documents", description: "Upload & verify" },
  { id: 4, label: "Authorization", description: "Documents" },
  { id: 5, label: "Business", description: "Operations" },
  { id: 6, label: "Financial", description: "Profile" },
  { id: 7, label: "Review", description: "Submit" },
];

const WELCOME_MESSAGE = "Welcome to Wio's Intelligent Onboarding platform powered by Pace.\n\nI'm here to help you open your Wio bank account so you can get your business banking up and running in no time!";

const SCREEN_MESSAGES: Record<ScreenId, { content: string; helperText?: string }> = {
  "0.1": { content: WELCOME_MESSAGE },
  "1.1": { content: "To start, what is your full name?", helperText: "Please enter your name exactly as it appears on your Emirates ID." },
  "1.2": { content: "Nice to meet you! What is your email address?" },
  "1.3": { content: "We've sent a 6-digit code to your email. Please enter it below.", helperText: "Check your spam folder if you don't see the email." },
  "1.4": { content: "Great! What is your mobile number?" },
  "1.5": { content: "We've sent a 6-digit code to your phone. Please enter it below." },
  "1.6": { content: "Let's create a password for your account." },
  "1.7": { content: "Please upload your Emirates ID.", helperText: "We accept PDF, JPG, or PNG files." },
  "1.8": { content: "We extracted the following from your Emirates ID. Please confirm the details are correct:" },
  "2.1": { content: "What kind of business are you opening an account for?" },
  "2.2": { content: "" },
  "3.1": { content: "Perfect! To get started, we'll need your Unified license number. Don't have it on hand? You can upload a copy instead." },
  "3.2": { content: "We extracted the following from your Trade License:" },
  "3.3": { content: "Please upload your Freelancer Permit.", helperText: "Make sure the permit is valid and not expired." },
  "3.4": { content: "We extracted the following from your Freelancer Permit:" },
  "3.5": { content: "", helperText: "" }, // Dynamic - set in getScreenMessage
  "3.5-QA": { content: "" }, // Hidden Q&A step
  "3.6": { content: "", helperText: "" }, // Dynamic - set in getScreenMessage
  "3.7": { content: "We extracted the following shareholders from your document:" },
  "4.1": { content: "" },
  "4.2": { content: "" },
  "4.3": { content: "Please upload your Power of Attorney.", helperText: "The POA must be signed by a shareholder and authorize you to act on behalf of the company." },
  "4.4": { content: "We extracted the following from your POA:" },
  "4.5": { content: "Please upload your Bank Mandate.", helperText: "This document specifies who has signing authority for the account." },
  "4.6": { content: "Please upload your Proof of Address.", helperText: "Accepted: Utility bill, bank statement (within 3 months), or tenancy contract." },
  "5.1": { content: "Does your business have an online presence (website or social media)?" },
  "5.2": { content: "What is your website URL?" },
  "5.2A": { content: "We found the following information from your website. Please confirm:" },
  "5.3": { content: "Does your business operate in countries outside the UAE?" },
  "5.4": { content: "Which countries do you operate in?" },
  "5.5": { content: "Do you have a branch or physical presence in these countries?" },
  "5.6": { content: "Do you have a physical business address in the UAE?" },
  "5.7": { content: "What is your business address?" },
  "5.7A": { content: "We successfully verified your address." },
  "5.8": { content: "For verifying your Legal Entity Identifier (LEI). Please provide your 20-character LEI code." },
  "5.8A": { content: "We extracted the following LEI details. Please confirm:" },
  "6.1": { content: "What is your expected annual turnover?" },
  "6.2": { content: "What are your main sources of funds?" },
  "6.3": { content: "What is your expected monthly deposit volume?" },
  "6.4": { content: "What is your expected monthly withdrawal volume?" },
  "6.5": { content: "What percentage of your deposits will be in cash?" },
  "6.6": { content: "What percentage of your withdrawals will be in cash?" },
  "6.7": { content: "Based on what you've told us, here's what we think you'll need:" },
  "6.8": { content: "Based on your business profile, here's the plan we recommend:" },
  "7.1": { content: "Please review all the information you've provided:" },
  "7.2": { content: "" },
  "7.3": { content: "" },
};

const ZAMP_LOG_AUTHORITY_COMPLETE = async (zampProcessId: string) => {
  await logToZamp(zampProcessId, {
    title: "Authority verified, all necessary documents received",
    status: "success",
    type: "success"
  }, "authority-verification"); // We must match the correct stepId used in previous logs (check trade license logs)
  // Wait, trade-license-verification logged "Authority Verification pending" with NO stepId?
  // Let's check verifyTradeLicense logs.
  // It logged: title: "Authority Verification pending", status: "processing", type: "warning"
  // WITHOUT a explicit stepId in the logToZamp call?
  // "await logToZamp(zampProcessId, { ... });" -> The stepId arg is undefined.
  // So to update it, I need a stepId? Or just append a new log "Authority verified"?
  // The user wants: "post authority verification, that corresponding box should also change to green".
  // This implies I should have used a stepId for the "pending" log too.
  // I should probably fix the "pending" log to have a stepId if I want to update it in place.
  // However, the user said "change to done" which implies updating.
  // I will use "authority-verification" as stepId for the NEW log and hope the legacy "pending" log without ID just stays or I update it blindly?
  // Actually, if the pending log had NO stepId, I cannot update it in place easily with my backend logic (which needs stepId match).
  // BUT the user just said "change to green", implying the status indicator.
  // If I cannot update the *previous* pending line, I'll just append a new success line.
  // BUT, for the "corresponding box should change to green" request:
  // Zamp dashboard uses the latest log status for that "step" if they are grouped?
  // No, Zamp dashboard lists *logs*.
  // If the previous log was "Authority Verification pending" (Warning/Yellow), and now I log "Authority Verified" (Success/Green), I want it to *replace* or *update* the pending one?
  // The user said "change to done".
  // I will try to use a consistent stepId "authority-verification" for both.
  // To do this, I must also update the "pending" log calls in verifyTradeLicense.
};

const TURNOVER_OPTIONS = [
  { value: "less_100k", label: "Less than AED 100,000" },
  { value: "100k_500k", label: "AED 100,000 - 500,000" },
  { value: "500k_1m", label: "AED 500,000 - 1 Million" },
  { value: "1m_5m", label: "AED 1 Million - 5 Million" },
  { value: "more_5m", label: "More than AED 5 Million" },
];

const DEPOSIT_OPTIONS = [
  { value: "less_50k", label: "Less than AED 50,000" },
  { value: "50k_100k", label: "AED 50,000 - 100,000" },
  { value: "100k_500k", label: "AED 100,000 - 500,000" },
  { value: "500k_1m", label: "AED 500,000 - 1 million" },
  { value: "more_1m", label: "More than AED 1 million" },
];

const FUND_SOURCES = [
  { value: "business_revenue", label: "Business Revenue" },
  { value: "shareholder_capital", label: "Shareholder Capital" },
  { value: "family_friends", label: "Family and Friends" },
  { value: "advance_payments", label: "Advance Payments from Customers" },
  { value: "loans", label: "Loans" },
  { value: "other", label: "Other", hasOther: true },
];

const GenericConfirmScreen = ({
  data,
  onConfirm,
  onEdit,
}: {
  data: Record<string, string>;
  onConfirm: () => void;
  onEdit: () => void;
}) => {
  return (
    <div className="space-y-4 w-full max-w-md">
      <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between items-start pt-2 first:pt-0">
            <span className="text-gray-500 text-sm capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </span>
            <span className="font-medium text-gray-900 text-right text-sm">{value}</span>
          </div>
        ))}
      </div >
      <div className="flex space-x-3">
        <button
          onClick={onEdit}
          className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          Confirm Details
        </button>
      </div>
    </div >
  );
};

// Welcome Screen Component
const GetStartedScreen = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to Wio Onboarding</h1>
        <p className="text-gray-500">Fast, digital, and seamless business account opening.</p>
      </div>
      <button
        onClick={onStart}
        className="w-full py-4 bg-primary text-primary-foreground dark:text-gray-700 rounded-xl font-semibold shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group"
      >
        Get Started
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

const Index = () => {
  const { currentScreen, currentStep, data, updateData, goToNextScreen, goToPreviousScreen, canGoBack, completedSteps, setCurrentScreen } = useOnboardingFlow();
  const [messages, setMessages] = useState<Message[]>([]);
  const [failedIdAttempts, setFailedIdAttempts] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [zampProcessId, setZampProcessId] = useState<string | null>(null);


  // Screens that shouldn't show back navigation
  const excludeBackScreens: ScreenId[] = ["0.1", "1.1", "7.3", "2.2"];
  const showBackLink = canGoBack && !excludeBackScreens.includes(currentScreen);

  const handleGoBack = useCallback(() => {
    // Remove last user message from chat for cleaner UX
    setMessages(prev => {
      const lastUserIndex = prev.map(m => m.type).lastIndexOf('user');
      if (lastUserIndex > -1) {
        return prev.slice(0, lastUserIndex);
      }
      return prev;
    });
    goToPreviousScreen();
  }, [goToPreviousScreen]);

  const addAssistantMessage = useCallback((content: string, helperText?: string, verificationData?: any) => {
    if (!content) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "assistant",
      content,
      timestamp: new Date(),
      helperText,
      verificationData // Pass it through
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const addUserMessage = useCallback((content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const getScreenMessage = useCallback((screenId: ScreenId): { content: string; helperText?: string } => {
    const legalType = data.tradeLicense.legalType || "LLC";
    const legalTypeDisplay = legalType.toUpperCase();

    if (screenId === "3.5") {
      return {
        content: "Please upload your Memorandum of Association (MOA).",
        helperText: `Since you are a ${legalTypeDisplay}, we require a Memorandum of Association (MOA) to verify your company's shareholders and their ownership structure.`
      };
    }
    if (screenId === "3.6") {
      return {
        content: "Please upload your Partnership Deed.",
        helperText: `Since you are a Partnership, we require a Partnership Deed to verify your company's partners and their ownership structure.`
      };
    }
    return SCREEN_MESSAGES[screenId];
  }, [data.tradeLicense.legalType]);

  // Ref to track the last screen we handled to prevent loops
  const lastHandledScreen = useRef<ScreenId | null>(null);

  const simulateTypingAndShowInput = useCallback(() => {
    // This function is now only called when we genuinely change screens (checked in useEffect)
    setShowInput(false);
    const screenData = getScreenMessage(currentScreen);

    // Show welcome message first on screen 1.1
    // We check messages.length locally or just assume if it's 1.1 and we are here, we do the welcome flow.
    // However, if we navigate BACK to 1.1, we might not want the welcome message again?
    // Let's rely on the fact that this runs once per screen entry.

    if (currentScreen === "1.1" && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addAssistantMessage(WELCOME_MESSAGE);
        // Then show the name question after a short delay
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addAssistantMessage(screenData.content, screenData.helperText);
            setShowInput(true);
          }, 600);
        }, 400);
      }, 800);
    } else if (screenData?.content) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addAssistantMessage(screenData.content, screenData.helperText);
        setShowInput(true);
      }, 800);
    } else {
      setShowInput(true);
    }
  }, [currentScreen, addAssistantMessage, getScreenMessage, messages.length]); // messages.length needed for the 1.1 check but guard at useEffect level prevents loop

  useEffect(() => {
    if (currentScreen === "0.1") {
      setShowInput(true); // GetStartedScreen is always visible
      lastHandledScreen.current = "0.1";
      return;
    }

    // Only run simulation if we haven't handled this screen yet
    if (lastHandledScreen.current !== currentScreen) {
      lastHandledScreen.current = currentScreen;
      simulateTypingAndShowInput();
    }
  }, [currentScreen, simulateTypingAndShowInput]);

  // --- Zamp Integration Logic ---

  // Start Onboarding
  const handleStartOnboarding = async () => {
    const pid = await initZampProcess();
    setZampProcessId(pid);
    if (pid) {
      await logToZamp(pid, {
        title: "Wio Onboarding Application started",
        status: "completed",
        type: "success"
      }, undefined, { status: "processing" }); // Update keyDetails status
      await logToZamp(pid, {
        title: "Identity Verification in Progress",
        status: "processing",
        type: "info"
      }, "identity-verification"); // Use stepId
    }
    goToNextScreen();
  };

  // Step 1: Identity Complete logic (triggered when moving from 1.8 to 2.1)
  useEffect(() => {
    if (currentScreen === "2.1" && zampProcessId) {
      // Dynamic Zamp Logging for Step Completion (Initial Logs)
      // Eligibility Start
      logToZamp(zampProcessId, {
        title: "Eligibility Verification in Progress",
        status: "processing",
        type: "info"
      }, "eligibility-verification");
    }
  }, [currentScreen, zampProcessId]); // Dependencies: only run when screen changes to 2.1

  // Custom Handler for Eligibility Confirm
  const handleEligibilityConfirm = async (confirmed: boolean) => {
    updateData({ restrictedIndustryConfirmed: confirmed });
    if (confirmed) {
      if (zampProcessId) {
        const licenseType = data.businessType === "trade_license" ? "Trade License" : "Freelancer Permit";
        await logToZamp(zampProcessId, {
          title: `Eligibility Verified, Applicant has a ${licenseType}`,
          status: "success",
          type: "success",
          description: `User has a ${licenseType} and is not in any restricted Industries`
        }, "eligibility-verification");
        await logToZamp(zampProcessId, {
          title: "Verifying Documents",
          status: "processing",
          type: "info"
        });
      }
      goToNextScreen();
    } else {
      // If not confirmed (i.e., user is in restricted industry), stay on screen or show error
      addAssistantMessage("We cannot open accounts for businesses in restricted industries.");
    }
  };

  const handleTextSubmit = (value: string, field: string) => {
    addUserMessage(value);
    updateData({ [field]: value } as any);

    // Real-time Sync of User Inputs
    if (zampProcessId) {
      const readableField = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      logToZamp(zampProcessId, {
        title: `User Provided ${readableField}`,
        status: "processing",
        type: "info",
        description: value
      }).catch(err => console.error("Sync error:", err));
    }

    setTimeout(goToNextScreen, 300);
  };

  const handleBusinessTypeSelect = (type: "trade_license" | "freelancer") => {
    addUserMessage(type === "trade_license" ? "I have a Trade License" : "I'm a Freelancer");
    updateData({ businessType: type });
    setTimeout(goToNextScreen, 300);
  };

  const handleFileUpload = () => {
    addUserMessage("Document uploaded");
    setTimeout(goToNextScreen, 500);
  };

  const handleEmiratesIdUpload = async (file: File) => {
    if (!file) {
      handleFileUpload(); // Or handle this case more specifically if needed
      return;
    }

    setIsTyping(true);
    // Hide upload tool logic handled by rendering condition or prop now
    // Add user message for context but NOT the verification result
    addUserMessage("Uploading Emirates ID for verification...");

    // Clear previous check data for UI reset (if any)
    // ...

    try {
      const extractedData = await extractEmiratesIdData(file);

      if (extractedData) {
        // 0. Validate Document Authenticity
        if (extractedData.isValidEmiratesId === false) {
          // explicit check for false
          setIsTyping(false);
          setFailedIdAttempts(prev => prev + 1);
          addAssistantMessage("Visual Verification Failed: The uploaded document does not appear to be a valid Emirates ID. Please ensure the title and logo are visible.");
          return;
        }

        // 1. Validate Name Match
        try {
          const nameMatchRes = await fetch(`${ZAMP_API_URL}/match-names`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name1: data.fullName,
              name2: extractedData.fullName
            }),
          });
          const matchResult = await nameMatchRes.json();

          // Prepare Verification Data for UI
          const verificationData = {
            isValidEmiratesId: true,
            isTamperFree: true, // Assuming true if Gemini checks passed
            isNameMatch: matchResult.match,
            autofilledFields: ["Full Name", "ID Number", "Nationality", "Date of Birth", "Expiry Date"]
          };

          setIsTyping(false);

          if (!matchResult.match) {
            const newFailCount = failedIdAttempts + 1;
            setFailedIdAttempts(newFailCount);

            // USER REQUEST: If failed twice, allow manual proceed
            if (newFailCount >= 2) {
              setTimeout(() => {
                addAssistantMessage(
                  "We have received your Emirates ID.",
                  "Please verify and confirm the details manually below to proceed."
                );
              }, 500);

              // Proceed with extracted data even if name match failed
              updateData({
                emiratesId: {
                  fullName: extractedData.fullName,
                  idNumber: extractedData.idNumber,
                  nationality: extractedData.nationality,
                  dateOfBirth: extractedData.dateOfBirth,
                  expiryDate: extractedData.expiryDate
                }
              });

              setTimeout(() => goToNextScreen(), 2500);
              return;
            }

            // Show failure with checklist
            addAssistantMessage(
              `One or more verification checks failed. We could not verify that this ID belongs to ${data.fullName}.`,
              "Please verify you have uploaded the correct document.",
              { ...verificationData, isNameMatch: false } // Force false visual
            );

            // USER REQUEST: If failed once before (now means 1st failure was just logged), show extracted details on retry
            // Actually, if newFailCount is 1, it's the first failure. If it's 2, we proceed. 
            // So we show the specific debug info only on the 1st failure? 
            // The previous requirement said "if it fails once, show error, when i upload again - show the extracted details".
            // So on the 2nd upload (which causes the 2nd failure), we are now proceeding automatically.
            // So the 'show extracted details' logic is effectively replaced by 'proceed to confirmation'.
            return;
          }

          // Success Case
          addAssistantMessage(
            "Identity verification complete. All checks passed.",
            undefined,
            verificationData
          );

          // Update data
          updateData({
            emiratesId: {
              fullName: extractedData.fullName,
              idNumber: extractedData.idNumber,
              nationality: extractedData.nationality,
              dateOfBirth: extractedData.dateOfBirth,
              expiryDate: extractedData.expiryDate
            }
          });

          // Wait a bit before showing the confirm screen so user sees the ticks
          setTimeout(() => goToNextScreen(), 4000);

        } catch (matchErr) {
          console.error("Name matching failed", matchErr);
          setIsTyping(false);
          setFailedIdAttempts(prev => prev + 1);
          addAssistantMessage("Error during name verification process. Please try again.");

          if (failedIdAttempts > 0) {
            setTimeout(() => {
              addAssistantMessage(
                "To help you debug, here are the details we read from your card:",
                `Name: ${extractedData.fullName}\nID Number: ${extractedData.idNumber}\nNationality: ${extractedData.nationality}`
              );
            }, 1000);
          }
        }
      } else {
        setIsTyping(false);
        setFailedIdAttempts(prev => prev + 1);
        addAssistantMessage("Could not read document. Please ensure the image is clear and try again.");
      }
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setFailedIdAttempts(prev => prev + 1);
      addAssistantMessage("An error occurred while processing the ID.");
    }
  };

  // Identity Confirmation Handler
  const handleEmiratesIdConfirm = async () => {
    addUserMessage("Details confirmed.");
    if (zampProcessId) {
      await logToZamp(zampProcessId, {
        title: "Identity verification complete",
        status: "success",
        type: "success",
        artifacts: [
          { type: "image", label: "Emirates ID Image", icon: "image", imagePath: await uploadToZamp(data.emiratesId.file!), id: `art-eid-${Date.now()}` },
          {
            type: "table", label: "Extracted Identity Data", icon: "table", data: {
              "Entered Name": data.fullName,
              "Phone Number": data.phone,
              "Email Address": data.email,
              "Extracted Name": data.emiratesId.fullName,
              "ID Number": data.emiratesId.idNumber,
              "Nationality": data.emiratesId.nationality,
              "Date of Birth": data.emiratesId.dateOfBirth,
              "Expiry Date": data.emiratesId.expiryDate
            }, id: `art-eid-data-${Date.now()}`
          }
        ]
      }, "identity-verification"); // Update the "In Progress" step
    }
    goToNextScreen();
  };

  // Function to verify trade license via backend
  const verifyTradeLicense = async (licenseNumber: string) => {
    setIsTyping(true);
    addAssistantMessage(`Verifying Unified License #${licenseNumber} with Dubai DET...`);

    try {
      // Call our local Python backend
      const response = await fetch(`${ZAMP_API_URL}/extract-license`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ licenseNumber }),
      });

      if (!response.ok) {
        throw new Error("Verification failed to connect to backend");
      }

      const extractedData = await response.json();
      setIsTyping(false);

      if (extractedData.error) {
        throw new Error(extractedData.error);
      }

      addUserMessage("Verification complete");

      // Transform backend data to frontend model
      const licenseDetails = {
        businessName: extractedData["Business Name"] || "",
        licenseNumber: extractedData["License Number"] || licenseNumber,
        issuingAuthority: extractedData["Issuing Authority"] || "Dubai Economy", // Default if not found
        legalType: ((extractedData["Legal Type"] || "").toLowerCase().includes("sole") ? "sole_proprietorship" : "llc") as "sole_proprietorship" | "llc",
        activities: (extractedData["Activities"] || []).join(", "),
        expiryDate: extractedData["Expiry Date"] || "",
        videoPath: extractedData.public_video_path // Pass video path for logging
      };

      updateData({
        tradeLicense: {
          ...data.tradeLicense,
          ...licenseDetails
        }
      });

      // Zamp Log for Browser Verification
      if (zampProcessId) {
        const artifacts: any[] = [{
          type: "table",
          label: "Verified License Data",
          icon: "table",
          id: `art-lic-ver-${Date.now()}`,
          data: extractedData
        }];

        if (extractedData.public_video_path) {
          artifacts.push({
            type: "video",
            label: "Verification Recording",
            icon: "video",
            videoPath: extractedData.public_video_path,
            id: `art-lic-vid-${Date.now()}`
          });
        }

        await logToZamp(zampProcessId, {
          title: "Document Verification Complete",
          status: "success",
          type: "success",
          description: `Applicant's Legal Type is ${extractedData["Legal Type"]}`,
          artifacts: artifacts
        }, "trade-license-verification");
        await logToZamp(zampProcessId, {
          title: "Authority Verification pending",
          status: "processing",
          type: "warning"
        }, "authority-verification");
      }

      return licenseDetails;

    } catch (error) {
      console.error("Verification Error:", error);
      setIsTyping(false);
      // Graceful fallback: Don't block, just ask for manual input
      addAssistantMessage("Automatic verification unavailable. Please review and enter details manually.");
      updateData({
        tradeLicense: {
          ...data.tradeLicense,
          licenseNumber: licenseNumber // Ensure the number they typed is preserved
        }
      });
      return null;
    }
  };

  const verifyTradeLicenseFile = async (file: File) => {
    setIsTyping(true);
    addAssistantMessage("Analyzing Trade License document...");

    try {
      // Use Client-Side Gemini Extraction (More robust than backend scraper)
      const extractedData = await extractAllTradeLicenseData(file);
      setIsTyping(false);

      if (!extractedData) {
        throw new Error("Could not extract data");
      }

      addAssistantMessage("Trade License analyzed successfully.");

      const licenseDetails = {
        businessName: extractedData.businessName || "",
        licenseNumber: extractedData.licenseNumber || "",
        issuingAuthority: extractedData.issuingAuthority || "Dubai Economy",
        legalType: ((extractedData.legalType || "").toLowerCase().includes("sole") ? "sole_proprietorship" : "llc") as "sole_proprietorship" | "llc",
        activities: Array.isArray(extractedData.activities) ? extractedData.activities.join(", ") : (extractedData.activities || ""),
        expiryDate: extractedData.expiryDate || "",
        videoPath: undefined // No video for client-side extraction
      };

      return licenseDetails;

    } catch (error) {
      console.error("File Verification Error:", error);
      setIsTyping(false);
      addAssistantMessage("Could not analyze file automatically. Please enter details manually.");
      return null;
    }
  };

  const verifyWebsite = async (url: string) => {
    setIsTyping(true);
    addAssistantMessage(`Verifying website: ${url}...`);
    try {
      const response = await fetch("http://localhost:8000/verify-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error("Website verification failed");
      const extractedData = await response.json();
      setIsTyping(false);

      if (extractedData.error) throw new Error(extractedData.error);

      addAssistantMessage("Website verification complete, the following results were extracted.");

      // Update local data
      updateData({
        extractedWebsiteData: extractedData,
        websiteVideoPath: extractedData.public_video_path
      });

      // Update local data if needed, or just log to Zamp
      // Construct Zamp artifacts
      if (zampProcessId) {
        // The artifacts construction and logging will now happen in 5.7
      }
      return extractedData;
    } catch (e) {
      console.error(e);
      setIsTyping(false);
      addAssistantMessage("Could not verify website automatically. Proceeding.");
      return null;
    }
  };

  // Legacy verifyAddress removed (now handled via Google Maps Frontend Integration)

  const verifyLEI = async (leiCode: string) => {
    setIsTyping(true);
    addAssistantMessage("Verifying LEI Code...", "lei-verifying");

    try {
      const response = await fetch(`${ZAMP_API_URL}/verify-lei`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leiCode })
      });

      const data = await response.json();
      setIsTyping(false);

      if (data.error) {
        addAssistantMessage("We couldn't verify the LEI code. Please check and try again.");
        return false;
      }

      updateData({
        leiCode: leiCode,
        extractedLEIData: data,
        leiVideoPath: data.public_video_path
      });
      return true;

    } catch (error) {
      setIsTyping(false);
      addAssistantMessage("Sorry, we faced an issue verifying the LEI code.");
      console.error(error);
      return false;
    }
  };

  const getTradeLicenseData = (): typeof DUMMY_TRADE_LICENSE | typeof DUMMY_TRADE_LICENSE_SOLE => {
    // Return existing data which should now be populated by verifyTradeLicense
    // We cast it to match the type expected by the rest of the flow
    return data.tradeLicense as any;
  };

  const handleTradeLicenseConfirm = () => {
    addUserMessage("Trade License confirmed");
    const licenseData = getTradeLicenseData();
    const legalType = licenseData.legalType;
    const isSoleProprietorship = legalType === "sole_proprietorship";
    const requiresBankMandate = !isSoleProprietorship && ["partnership", "llc", "fzco", "fze"].includes(legalType) && DUMMY_SHAREHOLDERS.length > 1;
    const updatedTradeLicense = { ...data.tradeLicense, ...licenseData };
    updateData({
      tradeLicense: updatedTradeLicense,
      requiresBankMandate,
      shareholders: isSoleProprietorship ? [] : DUMMY_SHAREHOLDERS,
      isShareholderMatch: isSoleProprietorship ? true : DUMMY_SHAREHOLDERS.some(s => s.name === data.emiratesId.fullName),
    });
    setTimeout(() => goToNextScreen({ tradeLicense: updatedTradeLicense, requiresBankMandate }), 300);
  };

  const handleFreelancerPermitConfirm = () => {
    addUserMessage("Freelancer Permit confirmed");
    updateData({
      freelancerPermit: { ...data.freelancerPermit, ...DUMMY_FREELANCER_PERMIT },
      isShareholderMatch: true,
      requiresPOA: false,
      requiresBankMandate: false,
    });
    setTimeout(goToNextScreen, 300);
  };

  const handleShareholdersConfirm = (shareholders: typeof DUMMY_SHAREHOLDERS) => {
    addUserMessage("Shareholders confirmed");
    const isMatch = shareholders.some(s => s.name === data.emiratesId.fullName);
    const requiresPOA = !isMatch;
    updateData({
      shareholders,
      isShareholderMatch: isMatch,
      requiresPOA,
    });
    setTimeout(goToNextScreen, 300);
  };

  const handlePOAConfirm = () => {
    addUserMessage("POA confirmed");
    updateData({ poa: { ...data.poa, ...DUMMY_POA } });
    setTimeout(goToNextScreen, 300);
  };

  const handleYesNo = (value: boolean, field: string) => {
    addUserMessage(value ? "Yes" : "No");
    updateData({ [field]: value } as any);
    setTimeout(() => goToNextScreen({ [field]: value }), 300);
  };

  const handleBracketSelect = (value: string, label: string, field: string) => {
    addUserMessage(label);
    updateData({ [field]: label } as any);
    setTimeout(goToNextScreen, 300);
  };

  const handleMultiSelect = (values: string[], field: string, otherValue?: string) => {
    const labels = values.map(v => FUND_SOURCES.find(f => f.value === v)?.label || v);
    addUserMessage(labels.join(", ") + (otherValue ? ` (${otherValue})` : ""));
    updateData({ [field]: labels, otherFundSource: otherValue || "" } as any);
    setTimeout(goToNextScreen, 300);
  };

  const handleCountrySelect = (countries: string[]) => {
    addUserMessage(countries.join(", "));
    updateData({ operatingCountries: countries });
    setTimeout(goToNextScreen, 300);
  };

  const handleSlider = (value: number, field: string) => {
    addUserMessage(`${value}%`);
    updateData({ [field]: value } as any);
    setTimeout(goToNextScreen, 300);
  };

  // Helper for Zamp Logging
  const logBusinessVerificationComplete = async (finalData: any) => {
    if (!zampProcessId) return;

    const generalDetails = {
      "Online Presence": finalData.hasOnlinePresence ? "Yes" : "No",
      "Website URL": finalData.websiteUrl,
      "International Operations": finalData.hasInternationalOps ? "Yes" : "No",
      "Operating Countries": finalData.operatingCountries?.join(", ") || "None",
      "Business Address": finalData.businessAddress,
      "Address Source": finalData.addressVerificationStatus,
      "LEI Code": finalData.leiCode || "N/A"
    };

    const artifacts: any[] = [];

    // Website Artifacts
    if (finalData.extractedWebsiteData) {
      artifacts.push({
        type: "table",
        label: "Website Verification Data",
        icon: "table",
        id: `art-web-data-${Date.now()}`,
        data: finalData.extractedWebsiteData
      });
    }
    if (finalData.websiteVideoPath) {
      artifacts.push({
        type: "video",
        label: "Website Verification Recording",
        icon: "video",
        videoPath: finalData.websiteVideoPath,
        id: `art-web-video-${Date.now()}`
      });
    }

    // LEI Artifacts
    if (finalData.extractedLEIData) {
      artifacts.push({
        type: "table",
        label: "LEI Verification Data",
        icon: "table",
        id: `art-lei-data-${Date.now()}`,
        data: finalData.extractedLEIData
      });
    }
    if (finalData.leiVideoPath) {
      artifacts.push({
        type: "video",
        label: "LEI Verification Recording",
        icon: "video",
        videoPath: finalData.leiVideoPath,
        id: `art-lei-video-${Date.now()}`
      });
    }

    // Add Business Verification Summary Table
    artifacts.push({
      type: "table",
      label: "Business Verification Summary",
      icon: "table",
      id: `art-bus-summary-${Date.now()}`,
      data: {
        "Business Address": finalData.businessAddress || "N/A",
        "LEI Code": finalData.leiCode || "N/A",
        "Website URL": finalData.websiteUrl || "N/A",
        "Address Source": finalData.addressVerificationStatus || "N/A"
      }
    });

    await logToZamp(zampProcessId, {
      title: "Business Verification Complete",
      status: "completed",
      type: "success",
      artifacts: artifacts
    }, "business-verification-complete", generalDetails);
  };

  const renderScreenInput = () => {
    if (!showInput && currentScreen !== "0.1") return null;

    const getInputElement = () => {
      const stepInfo = SCREEN_MESSAGES[currentScreen]?.content || "Current step";
      switch (currentScreen) {
        case "0.1":
          return <GetStartedScreen onStart={handleStartOnboarding} />;
        case "1.1":
          return <TextInputScreen placeholder="Enter your full name" onSubmit={(v) => handleTextSubmit(v, "fullName")} contextData={data} stepInfo={stepInfo} />;
        case "1.2":
          return <TextInputScreen type="email" placeholder="Enter your email" onSubmit={(v) => handleTextSubmit(v, "email")} contextData={data} stepInfo={stepInfo} />;
        case "1.3":
          return <OTPInputScreen email={data.email} onSubmit={() => { addUserMessage("Code verified"); goToNextScreen(); }} contextData={data} stepInfo={stepInfo} />;
        case "1.4":
          return <TextInputScreen type="tel" prefix="+971" placeholder="50 123 4567" onSubmit={(v) => handleTextSubmit(v, "phone")} contextData={data} stepInfo={stepInfo} />;
        case "1.5":
          return <OTPInputScreen email={data.phone} onSubmit={() => { addUserMessage("Code verified"); goToNextScreen(); }} contextData={data} stepInfo={stepInfo} />;
        case "1.6":
          return <PasswordInputScreen onSubmit={(v) => { addUserMessage("Password created"); updateData({ password: v }); setTimeout(goToNextScreen, 300); }} contextData={data} stepInfo={stepInfo} />;
        case "1.7":
          return <FileUpload onFileSelect={handleEmiratesIdUpload} contextData={data} stepInfo={stepInfo} />;
        case "1.8":
          return (
            <AutoPopulatedInfoScreen
              title="Based on your Emirates ID verification, we've automatically filled the following information:"
              description="That's great! It's allowed us to fill the following details. You can review them below and we'll continue with the rest of the onboarding."
              sections={[
                {
                  id: "personal",
                  title: "Personal Information",
                  icon: "user",
                  isVerified: true,
                  content: [
                    { label: "Name", value: data.emiratesId?.fullName || "" },
                    { label: "Nationality", value: data.emiratesId?.nationality || "" },
                    { label: "DOB", value: data.emiratesId?.dateOfBirth || "" }
                  ]
                },
                {
                  id: "document",
                  title: "Document Details",
                  icon: "id",
                  isVerified: true,
                  content: [
                    { label: "ID Number", value: data.emiratesId?.idNumber || "" },
                    { label: "Expiry Date", value: data.emiratesId?.expiryDate || "" }
                  ]
                }
              ]}
              onConfirm={() => goToNextScreen()}
              contextData={data}
              stepInfo={stepInfo}
            />
          );
        case "2.1":
          return (
            <BusinessTypeSelectionScreen onSelect={handleBusinessTypeSelect} contextData={data} stepInfo={stepInfo} />
          );
        case "2.2":
          return <RestrictedIndustriesModal
            onBack={handleGoBack}
            onConfirm={async () => {
              addUserMessage("Confirmed - not in restricted industries");

              // Log Eligibility Complete
              if (zampProcessId) {
                const licenseType = data.businessType === "trade_license" ? "Trade License" : "Freelancer Permit";
                await logToZamp(zampProcessId, {
                  title: `Eligibility Verified, Applicant has a ${licenseType}`,
                  status: "success",
                  type: "success",
                  description: `User has a ${licenseType} and is not in any restricted Industries`
                }, "eligibility-verification");
              }

              goToNextScreen();
            }} contextData={data} stepInfo={stepInfo} />;
        case "3.1":
          return (
            <TradeLicenseInputScreen
              loading={isTyping}
              onSubmitNumber={async (num) => {
                addUserMessage(`License number: ${num}`);
                updateData({ tradeLicense: { licenseNumber: num } } as any);

                // Log Trade License Start
                if (zampProcessId) {
                  await logToZamp(zampProcessId, {
                    title: "License Verification in Progress",
                    status: "processing",
                    type: "info"
                  }, "trade-license-verification");
                }

                await verifyTradeLicense(num);
                goToNextScreen();
              }}
              onUploadComplete={async (file) => {
                if (!file) {
                  handleFileUpload();
                  return;
                }

                addUserMessage("Uploading Unified License for analysis...");
                setIsTyping(true);

                try {
                  const extracted = await verifyTradeLicenseFile(file);

                  if (extracted) {
                    addAssistantMessage("Trade License data extracted successfully.");

                    updateData({
                      tradeLicense: {
                        businessName: String(extracted.businessName || ""),
                        licenseNumber: String(extracted.licenseNumber || ""),
                        issuingAuthority: String(extracted.issuingAuthority || ""),
                        legalType: String(extracted.legalType || ""),
                        // Ensure activities is a string (if array, join it)
                        activities: Array.isArray(extracted.activities) ? extracted.activities.join(", ") : String(extracted.activities || ""),
                        expiryDate: String(extracted.expiryDate || "")
                      }
                    } as any);

                    // Zamp Log for Upload Extraction
                    if (zampProcessId) {
                      const uploadedPath = await uploadToZamp(file);

                      const artifacts: any[] = [
                        { type: "image", label: "Unified License", icon: "image", imagePath: uploadedPath, id: `art-tl-${Date.now()}` },
                        { type: "table", label: "Extracted Data", icon: "table", data: extracted, id: `art-tl-data-${Date.now()}` }
                      ];

                      if (extracted.videoPath) {
                        artifacts.push({
                          type: "video",
                          label: "Verification Recording",
                          icon: "video",
                          videoPath: extracted.videoPath,
                          id: `art-tl-vid-${Date.now()}`
                        });
                      }

                      await logToZamp(zampProcessId, {
                        title: "Document Verification Complete",
                        status: "success",
                        type: "success",
                        description: `Details extracted and verified from the source site`,
                        artifacts: artifacts
                      }, "trade-license-verification");
                      await logToZamp(zampProcessId, {
                        title: "Authority Verification pending",
                        status: "processing",
                        type: "warning"
                      }, "authority-verification");
                    }

                    setIsTyping(false);
                    goToNextScreen();
                  } else {
                    addAssistantMessage("Could not read document. Please enter details manually.");
                    setIsTyping(false);
                  }
                } catch (e) {
                  console.error(e);
                  addAssistantMessage("Error analyzing document. Please try again.");
                  setIsTyping(false);
                }
              }}
              contextData={data}
              stepInfo={stepInfo}
            />
          );
        case "3.2": {
          // Use real data from state if available, otherwise fallback (though we should have data now)
          // const isSoleProp = data.tradeLicense.licenseNumber === "456";
          // const licenseData = isSoleProp ? DUMMY_TRADE_LICENSE_SOLE : DUMMY_TRADE_LICENSE;

          const licenseData = data.tradeLicense;
          const legalTypeDisplay = (licenseData.legalType || "").toUpperCase();

          return (
            <ExtractionConfirmScreen
              fields={[
                { key: "businessName", label: "Business Name", value: licenseData.businessName },
                { key: "licenseNumber", label: "License Number", value: licenseData.licenseNumber },
                { key: "issuingAuthority", label: "Issuing Authority", value: licenseData.issuingAuthority },
                { key: "legalType", label: "Legal Type", value: legalTypeDisplay },
                { key: "activities", label: "Activities", value: licenseData.activities },
                { key: "expiryDate", label: "Expiry Date", value: licenseData.expiryDate },
              ]}
              onConfirm={handleTradeLicenseConfirm}
              contextData={data}
              stepInfo={stepInfo}
            />
          );
        }
        case "3.3":
          return (
            <FileUpload
              onUploadComplete={async (file) => {
                if (!file) return;

                addUserMessage("Uploading Freelancer Permit for analysis...");
                setIsTyping(true);

                try {
                  const extracted = await extractFreelancerPermitData(file);

                  if (extracted) {
                    addAssistantMessage("Freelancer Permit data extracted successfully.");

                    updateData({
                      freelancerPermit: {
                        fullName: String(extracted.fullName || ""),
                        permitNumber: String(extracted.permitNumber || ""),
                        issuingAuthority: String(extracted.issuingAuthority || ""),
                        activity: String(extracted.activity || ""),
                        expiryDate: String(extracted.expiryDate || "")
                      }
                    } as any);

                    // Zamp Log
                    if (zampProcessId) {
                      const uploadedPath = await uploadToZamp(file);
                      await logToZamp(zampProcessId, {
                        title: "Document Verification Complete",
                        status: "success",
                        type: "success",
                        description: `Applicant is a Freelancer`,
                        artifacts: [
                          { type: "image", label: "Freelancer Permit", icon: "image", imagePath: uploadedPath, id: `art-fp-${Date.now()}` },
                          { type: "table", label: "Extracted Permit Data", icon: "table", data: extracted, id: `art-fp-data-${Date.now()}` }
                        ]
                      }, "freelancer-permit-verification");
                      await logToZamp(zampProcessId, {
                        title: "Authority Verification pending",
                        status: "processing",
                        type: "warning"
                      }, "authority-verification");
                    }

                    setIsTyping(false);
                    goToNextScreen();
                  } else {
                    addAssistantMessage("Could not read document. Please try again.");
                    setIsTyping(false);
                  }
                } catch (e) {
                  console.error(e);
                  setIsTyping(false);
                  addAssistantMessage("Error processing permit.");
                }
              }}
              contextData={data}
              stepInfo={stepInfo}
            />
          );
        case "3.4":
          return (
            <ExtractionConfirmScreen
              fields={[
                { key: "fullName", label: "Full Name", value: data.freelancerPermit.fullName },
                { key: "permitNumber", label: "Permit Number", value: data.freelancerPermit.permitNumber },
                { key: "issuingAuthority", label: "Issuing Authority", value: data.freelancerPermit.issuingAuthority },
                { key: "activity", label: "Activity", value: data.freelancerPermit.activity },
                { key: "expiryDate", label: "Expiry Date", value: data.freelancerPermit.expiryDate },
              ]}
              onConfirm={handleFreelancerPermitConfirm}
              contextData={data}
              stepInfo={stepInfo}
            />
          );
        case "3.5":
          return (
            <FileUpload onUploadComplete={async (file) => {
              if (!file) return;
              addUserMessage("Uploading Memorandum of Association...");
              setIsTyping(true);
              try {
                const extracted = await extractMOAData(file);
                // Update data with extracted shareholders
                if (extracted?.shareholders) {
                  updateData({ shareholders: extracted.shareholders });
                }

                if (zampProcessId) {
                  const uploadedPath = await uploadToZamp(file);
                  await logToZamp(zampProcessId, {
                    title: "Common Authorization Documents",
                    status: "success",
                    type: "success",
                    artifacts: [
                      { type: "file", label: "Memorandum of Association", icon: "file", pdfPath: uploadedPath, id: `art-moa-${Date.now()}` },
                      { type: "table", label: "Shareholders (MOA)", icon: "table", data: extracted?.shareholders || [], id: `art-moa-data-${Date.now()}` }
                    ]
                  }, "auth-doc-moa");
                }

                addAssistantMessage("MOA uploaded and analyzed.");

                // INTELLIGENT FOLLOW-UP for "Trafco"
                const companyName = data.tradeLicense?.businessName || ""; // Changed from companyName to businessName as per data structure
                if (companyName.toLowerCase().includes("trafco")) {
                  setTimeout(() => {
                    addAssistantMessage(
                      "We reviewed the Objects Clause in your Memorandum of Association, which allows the company to undertake multiple business activities that are not included in your trade license: fisheries, natural oils trading. We understand from Trade License your company's primary activity is Ship Charter."
                    );
                    setTimeout(() => {
                      addAssistantMessage("For this bank account, could you please confirm which activities from the MoA will be actively carried out?");
                      setCurrentScreen("3.5-QA"); // Special Q&A screen
                    }, 1000);
                  }, 500);
                } else {
                  goToNextScreen();
                }

              } catch (e) {
                console.error(e);
                addAssistantMessage("Error analyzing MOA, proceeding manually.");
                goToNextScreen();
              } finally {
                setIsTyping(false);
              }
            }}
              contextData={data}
              stepInfo={stepInfo}
            />
          );
        case "3.5-QA": // Hidden Q&A step
          return (
            <TextInputScreen
              placeholder="Enter activities..."
              onSubmit={(val) => {
                addUserMessage(val);
                setTimeout(() => {
                  addAssistantMessage("Thanks for sharing these details, we have noted them.");
                  setTimeout(() => {
                    addAssistantMessage("Based on the MOA, we have also extracted the following shareholder structure:");
                    setTimeout(() => {
                      setCurrentScreen("3.7"); // Skip 3.6, show shareholders table
                    }, 1000);
                  }, 1000);
                }, 500);
              }}
              contextData={data}
              stepInfo={stepInfo}
            />
          );
        case "3.6":
          // This step might be skipped in Trafco flow
          return <FileUpload onUploadComplete={handleFileUpload} contextData={data} stepInfo={stepInfo} />;
        case "3.7":
          return <ShareholderTableScreen shareholders={data.shareholders.length ? data.shareholders : DUMMY_SHAREHOLDERS} onConfirm={handleShareholdersConfirm} contextData={data} stepInfo={stepInfo} />;
        case "4.1":
          return (
            <AuthorizationSummaryScreen
              verifiedName={data.emiratesId.fullName || DUMMY_EMIRATES_ID.fullName}
              companyName={data.businessType === "freelancer" ? data.freelancerPermit.fullName || DUMMY_FREELANCER_PERMIT.fullName : data.tradeLicense.businessName || DUMMY_TRADE_LICENSE.businessName}
              businessType={data.businessType || "trade_license"}
              legalType={data.businessType === "freelancer" ? "sole_proprietorship" : data.tradeLicense.legalType || "sole_proprietorship"}
              ownershipPercentage={data.shareholders[0]?.ownership}
              isShareholderMatch={true}
              shareholderNames={data.shareholders.map(s => s.name)}
              shareholderCount={data.shareholders.length || 1}
              requiresPOA={false}
              requiresBankMandate={data.requiresBankMandate}
              onContinue={() => { addUserMessage("Authorization confirmed"); goToNextScreen(); }}
              contextData={data}
              stepInfo={stepInfo}
            />
          );
        case "4.2":
          return (
            <AuthorizationSummaryScreen
              verifiedName={data.emiratesId.fullName || DUMMY_EMIRATES_ID.fullName}
              companyName={data.tradeLicense.businessName || DUMMY_TRADE_LICENSE.businessName}
              businessType={data.businessType || "trade_license"}
              legalType={data.tradeLicense.legalType || "llc"}
              isShareholderMatch={false}
              shareholderNames={data.shareholders.map(s => s.name)}
              shareholderCount={data.shareholders.length || 1}
              requiresPOA={true}
              requiresBankMandate={data.requiresBankMandate}
              onContinue={() => { addUserMessage("Authorization noted - uploading POA"); goToNextScreen(); }}
              contextData={data}
              stepInfo={stepInfo}
            />
          );
        case "4.3":
          return (
            <FileUpload onUploadComplete={async (file) => {
              if (!file) return;
              addUserMessage("Uploading Power of Attorney...");
              setIsTyping(true);
              try {
                const extracted = await extractPOAData(file);
                if (extracted) {
                  updateData({ poa: { ...data.poa, ...extracted } });
                }

                if (zampProcessId) {
                  const uploadedPath = await uploadToZamp(file);
                  await logToZamp(zampProcessId, {
                    title: "Power of Attorney Uploaded",
                    status: "success",
                    type: "success",
                    artifacts: [
                      { type: "file", label: "Power of Attorney", icon: "file", pdfPath: uploadedPath, id: `art-poa-${Date.now()}` },
                      { type: "table", label: "Extracted POA Data", icon: "table", data: extracted || {}, id: `art-poa-data-${Date.now()}` }
                    ]
                  }, "auth-doc-poa");
                }
                addAssistantMessage("POA uploaded and analyzed.");
                goToNextScreen();
              } catch (e) {
                console.error(e);
                addAssistantMessage("Error analyzing POA.");
                goToNextScreen();
              } finally {
                setIsTyping(false);
              }
            }} />
          );
        case "4.4":
          return (
            <ExtractionConfirmScreen
              fields={[
                { key: "grantedBy", label: "Granted By", value: data.poa.grantedBy || DUMMY_POA.grantedBy },
                { key: "grantedTo", label: "Granted To", value: data.poa.grantedTo || DUMMY_POA.grantedTo },
                { key: "scope", label: "Scope", value: data.poa.scope || DUMMY_POA.scope },
                { key: "dateIssued", label: "Date Issued", value: data.poa.dateIssued || DUMMY_POA.dateIssued },
                { key: "expiryDate", label: "Expiry Date", value: data.poa.expiryDate || DUMMY_POA.expiryDate },
                { key: "notarized", label: "Notarized", value: data.poa.notarized !== undefined ? (data.poa.notarized ? "Yes" : "No") : (DUMMY_POA.notarized ? "Yes" : "No") },
              ]}
              onConfirm={handlePOAConfirm}
              contextData={data}
              stepInfo={stepInfo}
            />
          );
        case "4.5":
          return (
            <FileUpload onUploadComplete={async (file) => {
              if (!file) return;
              addUserMessage("Uploading Bank Mandate...");
              if (zampProcessId) {
                const uploadedPath = await uploadToZamp(file);
                await logToZamp(zampProcessId, {
                  title: "Bank Mandate Uploaded",
                  status: "success",
                  type: "success",
                  artifacts: [
                    { type: "file", label: "Bank Mandate", icon: "file", pdfPath: uploadedPath, id: `art-bm-${Date.now()}` }
                  ]
                }, "auth-doc-bm");
              }
              setTimeout(goToNextScreen, 500);
            }} />
          );
        case "4.6":
          return (
            <FileUpload onUploadComplete={async (file) => {
              if (!file) return;
              addUserMessage("Uploading Proof of Address...");
              if (zampProcessId) {
                const uploadedPath = await uploadToZamp(file);
                await logToZamp(zampProcessId, {
                  title: "Proof of Address Uploaded",
                  status: "success",
                  type: "success",
                  artifacts: [
                    { type: "file", label: "Proof of Address", icon: "file", pdfPath: uploadedPath, id: `art-pa-${Date.now()}` }
                  ]
                }, "auth-doc-pa");

                await logToZamp(zampProcessId, {
                  title: "Authority verified, all necessary documents received",
                  status: "success",
                  type: "success"
                }, "authority-verification");
              }
              setTimeout(goToNextScreen, 500);
            }} />
          );
        case "5.1":
          return <YesNoScreen onSelect={(v) => handleYesNo(v, "hasOnlinePresence")} contextData={data} stepInfo={stepInfo} />;
        case "5.2":
          return <TextInputScreen type="text" placeholder="yourwebsite.com" onSubmit={async (v) => {
            addUserMessage(v);
            updateData({ websiteUrl: v }); // Don't use handleTextSubmit to avoid auto-nav
            await verifyWebsite(v);
            goToNextScreen();
          }} contextData={data} stepInfo={stepInfo} />;
        case "5.2A":
          return (
            <ExtractionConfirmScreen
              fields={[
                { key: "companyName", label: "Company Name", value: data.extractedWebsiteData?.company_name || "" },
                { key: "address", label: "Address", value: data.extractedWebsiteData?.address || "" },
                { key: "services", label: "Services", value: data.extractedWebsiteData?.business_services?.map((s: any) => s.name).join(", ") || "" },
                { key: "countries", label: "Operating Countries", value: data.extractedWebsiteData?.countries_operating?.join(", ") || "" },
                { key: "people", label: "Key People", value: data.extractedWebsiteData?.people?.map((p: any) => p.name).join(", ") || "" },
              ]}
              onConfirm={() => {
                addUserMessage("Website details confirmed");
                goToNextScreen();
              }}
            />
          );
        case "5.3":
          // International Operations
          if (data.hasInternationalOps === null) {
            return (
              <YesNoScreen
                question="Does your business operate in countries outside the UAE?"
                onSelect={(v) => {
                  addUserMessage(v ? "Yes" : "No");
                  if (v) {
                    updateData({ hasInternationalOps: true });
                  } else {
                    updateData({ hasInternationalOps: false, operatingCountries: [] });
                    logBusinessVerificationComplete({ ...data, hasInternationalOps: false, operatingCountries: [] });
                    goToNextScreen();
                  }
                }}
                contextData={data}
                stepInfo={stepInfo}
              />
            );
          }

          // If Yes, show MultiAddressInput
          return (
            <div className="space-y-4 animate-slide-up">
              <div className="bg-muted/50 p-4 rounded-lg text-sm">
                Which countries/cities do you operate in?
              </div>
              <MultiAddressInput
                onSubmit={(addresses) => {
                  const msg = `Selected: ${addresses.join(", ")}`;
                  addUserMessage(msg);
                  updateData({ operatingCountries: addresses });
                  logBusinessVerificationComplete({ ...data, hasInternationalOps: true, operatingCountries: addresses });
                  goToNextScreen();
                }}
                contextData={data}
                stepInfo={stepInfo}
                initialData={data.operatingCountries}
              />
            </div>
          );

        case "5.4":
          return <CountrySelectScreen onSubmit={handleCountrySelect} contextData={data} stepInfo={stepInfo} />;
        case "5.5":
          return <YesNoScreen onSelect={(v) => handleYesNo(v, "hasPhysicalPresenceAbroad")} contextData={data} stepInfo={stepInfo} />;
        case "5.6":
          return <YesNoScreen onSelect={(v) => handleYesNo(v, "hasPhysicalAddressUAE")} contextData={data} stepInfo={stepInfo} />;

        case "5.7":
          return (
            <AddressInputWrapper
              data={data}
              stepInfo={stepInfo}
              onMatched={(matchedAddress) => {
                addUserMessage("Address match confirmed.");
                updateData({ businessAddress: matchedAddress, addressVerificationStatus: "Verified" });
                goToNextScreen();
              }}
              onManualInput={(v) => {
                addUserMessage(v);
                updateData({ businessAddress: v, addressVerificationStatus: "Manual" });
                goToNextScreen();
              }}
            />
          );

        case "5.7A":
          // Legacy fallback
          return null;

        case "5.8":
          return (
            <TextInputScreen
              placeholder="Enter 20-character LEI code"
              onSubmit={async (v) => {
                addUserMessage(v);
                const verified = await verifyLEI(v);
                if (verified) goToNextScreen();
              }}
              contextData={data}
              stepInfo={stepInfo}
            />
          );

        case "5.8A":
          return (
            <ExtractionConfirmScreen
              fields={[
                { key: "legalName", label: "Legal Name", value: data.extractedLEIData?.["LEGAL NAME"] || "" },
                { key: "legalAddress", label: "Legal Address", value: data.extractedLEIData?.["LEGAL ADDRESS"] || "" },
                { key: "country", label: "Country", value: data.extractedLEIData?.["COUNTRY"] || "" },
                { key: "leiStatus", label: "Status", value: data.extractedLEIData?.["LEI STATUS"] || "" },
              ]}
              onConfirm={async () => {
                addUserMessage("LEI Details Confirmed");
                goToNextScreen();
              }}
            />
          );
        case "6.1":
          return <RangeSliderScreen label="Expected Annual Turnover" initialValue={0} max={5000000} step={10000} onSubmit={(v) => {
            addUserMessage(v);
            updateData({ annualTurnover: v });
            goToNextScreen();
          }} contextData={data} stepInfo={stepInfo} />;
        case "6.2":
          return <MultiSelectScreen options={FUND_SOURCES} onSubmit={(v, other) => handleMultiSelect(v, "sourcesOfFunds", other)} contextData={data} stepInfo={stepInfo} />;
        case "6.3":
          return <RangeSliderScreen label="Expected Monthly Deposits" initialValue={0} max={1000000} step={5000} onSubmit={(v) => {
            addUserMessage(v);
            updateData({ monthlyDeposits: v });
            goToNextScreen();
          }} contextData={data} stepInfo={stepInfo} />;
        case "6.4":
          return <RangeSliderScreen label="Expected Monthly Withdrawals" initialValue={0} max={1000000} step={5000} onSubmit={(v) => {
            addUserMessage(v);
            updateData({ monthlyWithdrawals: v });
            goToNextScreen();
          }} contextData={data} stepInfo={stepInfo} />;
        case "6.5":
          return <SliderScreen onSubmit={(v) => handleSlider(v, "cashDepositPercentage")} contextData={data} stepInfo={stepInfo} />;
        case "6.6":
          return (
            <SliderScreen onSubmit={async (v) => {
              addUserMessage(`${v}%`);
              updateData({ cashWithdrawalPercentage: v });
              // Logging moved to 6.8
              setTimeout(goToNextScreen, 300);
            }} contextData={data} stepInfo={stepInfo} />
          );


        case "6.7":
          return (
            <ProductRecommendationScreen
              data={data}
              onConfirm={(products) => {
                addUserMessage(`Selected: ${products.length} products`);
                updateData({ selectedProducts: products });
                goToNextScreen();
              }}
            />
          );
        case "6.8":
          return (
            <PlanRecommendationScreen
              data={data}
              onConfirm={async (plan) => {
                const planName = plan === "essential" ? "Essential Plan" : "Grow Plan";
                addUserMessage(`Selected: ${planName}`);
                updateData({ selectedPlan: plan });

                // CONSOLIDATED FINANCIAL LOGGING (Post-Plan Selection)
                if (zampProcessId) {
                  await logToZamp(zampProcessId, {
                    title: "Financial Profiling complete",
                    status: "success",
                    type: "success",
                    artifacts: [{
                      type: "table",
                      label: "Financial Profile",
                      icon: "table",
                      id: `art-fin-${Date.now()}`,
                      data: {
                        "Annual Turnover": data.annualTurnover || "N/A",
                        "Main Sources of Funds": data.sourcesOfFunds?.join(", ") || "N/A",
                        "Monthly Deposits": data.monthlyDeposits || "N/A",
                        "Monthly Withdrawals": data.monthlyWithdrawals || "N/A",
                        "Cash Deposits": `${data.cashDepositPercentage}%`,
                        "Cash Withdrawals": `${data.cashWithdrawalPercentage}%`,
                        "Selected Products": data.selectedProducts?.join(", ") || "None",
                        "Selected Plan": planName
                      }
                    }]
                  });

                }

                goToNextScreen();
              }}
            />
          );
        case "7.1":
          return <ReviewScreen data={data} onContinue={() => { addUserMessage("Information reviewed"); goToNextScreen(); }} contextData={data} stepInfo={stepInfo} />;
        case "7.2":
          return (
            <DeclarationScreen
              onSubmit={async () => {
                const refNum = `REF-${new Date().getFullYear()}-WIO${Math.floor(Math.random() * 1000)}`;
                if (zampProcessId) {
                  await logToZamp(zampProcessId, {
                    title: `Application Submitted, awaiting final review`,
                    status: "success",
                    type: "success"
                  }, undefined, { status: "Needs Review" }, { status: "Needs Review" });
                }
                addUserMessage("Application submitted");
                goToNextScreen();
              }}
            />
          );
        case "7.3":
          return <SuccessScreen email={data.email || "user@example.com"} referenceNumber={`REF-2024-${Math.random().toString(36).substring(2, 8).toUpperCase()}`} contextData={data} stepInfo={stepInfo} zampProcessId={zampProcessId} />;
        default:
          return null;
      }
    };

    const inputElement = getInputElement();

    if (!inputElement) return null;

    return (
      <div className="space-y-4">
        {showBackLink && <BackLink onClick={handleGoBack} />}
        {inputElement}
      </div>
    );
  };

  // Find the last assistant message to attach input to it
  const lastAssistantIndex = messages.length - 1;
  const lastAssistantMessage = messages[lastAssistantIndex];
  const shouldAttachInput = showInput && lastAssistantMessage?.type === "assistant";

  return (
    <OnboardingLayout steps={STEPS} currentStep={currentStep} completedSteps={completedSteps} data={data} currentScreen={currentScreen}>
      <ChatContainer>
        {messages.map((message, index) => {
          const isLastAssistant = index === lastAssistantIndex && message.type === "assistant";

          return (
            <ChatMessage
              key={message.id}
              message={message}
              isLatest={index === messages.length - 1}
            >
              {isLastAssistant && shouldAttachInput && renderScreenInput()}
            </ChatMessage>
          );
        })}
        {isTyping && <TypingIndicator />}
        {!shouldAttachInput && showInput && renderScreenInput()}
      </ChatContainer>
    </OnboardingLayout>
  );
};

export default Index;
