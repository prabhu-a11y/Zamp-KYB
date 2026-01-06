import { useState } from "react";
import { Building2, Briefcase } from "lucide-react";
import { OptionCard } from "../OptionCard";
import { HelpChat } from "./HelpChat";

interface BusinessTypeSelectionScreenProps {
    onSelect: (type: "trade_license" | "freelancer") => void;
    contextData?: any;
    stepInfo?: string;
}

export function BusinessTypeSelectionScreen({ onSelect, contextData, stepInfo }: BusinessTypeSelectionScreenProps) {
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    if (isHelpOpen) {
        return (
            <HelpChat
                contextData={contextData}
                stepInfo={stepInfo || "Business Type Selection"}
                isOpen={true}
                onToggle={setIsHelpOpen}
            />
        );
    }

    return (
        <div className="space-y-3 animate-slide-up">
            <OptionCard
                icon={Building2}
                label="I have a Trade License"
                description="Registered business with UAE Trade License"
                onClick={() => onSelect("trade_license")}
            />
            <OptionCard
                icon={Briefcase}
                label="I'm a Freelancer"
                description="Independent freelancer with Freelancer Permit"
                onClick={() => onSelect("freelancer")}
            />
            <HelpChat
                contextData={contextData}
                stepInfo={stepInfo || "Business Type Selection"}
                isOpen={false}
                onToggle={setIsHelpOpen}
            />
        </div>
    );
}
