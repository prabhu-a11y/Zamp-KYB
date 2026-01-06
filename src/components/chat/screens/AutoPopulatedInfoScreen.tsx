import { Button } from "@/components/ui/button";
import { Check, Globe, Building2, FileText, MapPin, User } from "lucide-react";
import { HelpChat } from "./HelpChat";
import { useState } from "react";

export interface DataSection {
    id: string;
    title: string;
    icon: "globe" | "building" | "file" | "map" | "user" | "id";
    content: { label: string; value: string }[];
    isVerified?: boolean;
}

interface AutoPopulatedInfoScreenProps {
    title: string;
    description: string;
    sections: DataSection[];
    onConfirm: () => void;
    contextData?: any;
    stepInfo?: string;
}

export function AutoPopulatedInfoScreen({
    title,
    description,
    sections,
    onConfirm,
    contextData,
    stepInfo
}: AutoPopulatedInfoScreenProps) {
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    if (isHelpOpen) {
        return <HelpChat isOpen={true} onToggle={() => setIsHelpOpen(false)} contextData={contextData} stepInfo={stepInfo} />;
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "globe": return <Globe className="w-5 h-5 text-blue-500" />;
            case "building": return <Building2 className="w-5 h-5 text-blue-500" />;
            case "file": return <FileText className="w-5 h-5 text-blue-500" />;
            case "map": return <MapPin className="w-5 h-5 text-blue-500" />;
            case "user": return <User className="w-5 h-5 text-blue-500" />;
            case "id": return <User className="w-5 h-5 text-blue-500" />;
            default: return <FileText className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="animate-slide-up space-y-6">
            <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            </div>

            <div className="bg-card border border-border/50 rounded-xl p-5 space-y-6 shadow-sm">

                {/* Header Section */}
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground text-base">Auto-Populated Information</h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Separator */}
                <div className="h-px bg-border/50 w-full" />

                {/* Sections */}
                <div className="space-y-3">
                    {sections.map((section) => (
                        <div key={section.id} className="bg-muted/30 border border-white/5 rounded-lg p-4 flex gap-4 transition-colors hover:bg-muted/40">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                {getIcon(section.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-medium text-blue-400 text-sm">{section.title}</h4>
                                    {section.isVerified && <Check className="w-3 h-3 text-green-500" />}
                                </div>

                                <div className="space-y-1">
                                    {section.content.map((item, idx) => (
                                        <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                                            {item.label && <span className="text-xs text-muted-foreground uppercase tracking-wide">{item.label}:</span>}
                                            <span className="text-sm text-foreground font-medium truncate">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Button
                onClick={onConfirm}
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium"
            >
                Continue with Onboarding
            </Button>

            <HelpChat isOpen={false} onToggle={() => setIsHelpOpen(true)} contextData={contextData} stepInfo={stepInfo} />
        </div>
    );
}
