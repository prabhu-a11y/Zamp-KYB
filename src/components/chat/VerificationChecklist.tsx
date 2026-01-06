
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface VerificationData {
    isValidEmiratesId: boolean;
    isTamperFree: boolean;
    isNameMatch: boolean;
    autofilledFields: string[];
}

export const VerificationChecklist = ({ data }: { data: VerificationData }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timer1 = setTimeout(() => setStep(1), 500);
        const timer2 = setTimeout(() => setStep(2), 1500);
        const timer3 = setTimeout(() => setStep(3), 2500);
        const timer4 = setTimeout(() => setStep(4), 3500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, []);

    const Item = ({ label, isCompleted, index }: { label: string; isCompleted: boolean; index: number }) => (
        <div className={cn(
            "flex items-center gap-3 transition-opacity duration-500",
            step >= index ? "opacity-100" : "opacity-0"
        )}>
            {isCompleted ? (
                <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
            ) : (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            )}
            <span className="text-sm font-medium">{label}</span>
        </div>
    );

    return (
        <div className="bg-card border border-border/50 rounded-lg p-5 shadow-sm min-w-[320px] animate-fade-in">
            <h4 className="text-sm font-semibold mb-4 text-foreground">Verification Summary</h4>
            <div className="space-y-3">
                <Item
                    label="Valid Emirates ID"
                    isCompleted={step > 0 && data.isValidEmiratesId}
                    index={0}
                />
                <Item
                    label="No tampering detected"
                    isCompleted={step > 1 && data.isTamperFree}
                    index={1}
                />
                <Item
                    label="Emirates ID matches customer details"
                    isCompleted={step > 2 && data.isNameMatch}
                    index={2}
                />
            </div>

            {step >= 3 && (
                <div className="pt-4 border-t border-border mt-4 animate-slide-up">
                    <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
                        <Check className="w-3 h-3" />
                        Autofilled the following details:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {data.autofilledFields.map(field => (
                            <div key={field} className="text-xs bg-muted/50 px-3 py-2 rounded-md border border-border/50 text-foreground/80">
                                {field}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
