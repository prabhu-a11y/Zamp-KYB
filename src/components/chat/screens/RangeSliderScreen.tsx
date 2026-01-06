
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { HelpChat } from "./HelpChat";

interface RangeSliderScreenProps {
    onSubmit: (value: string) => void;
    initialValue?: number;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    label?: string;
    contextData?: any;
    stepInfo?: string;
}

export function RangeSliderScreen({
    onSubmit,
    initialValue = 0,
    min = 0,
    max = 10000000,
    step = 1000,
    unit = "AED",
    label = "Amount",
    contextData,
    stepInfo
}: RangeSliderScreenProps) {
    const [value, setValue] = useState<number>(initialValue);
    const [inputValue, setInputValue] = useState<string>(initialValue.toString());

    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    const handleSliderChange = (vals: number[]) => {
        setValue(vals[0]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawVal = e.target.value.replace(/[^0-9]/g, '');
        setInputValue(rawVal);

        const numVal = parseInt(rawVal, 10);
        if (!isNaN(numVal)) {
            if (numVal > max) {
                setValue(max);
            } else if (numVal < min) {
                setValue(min);
            } else {
                setValue(numVal);
            }
        } else {
            setValue(min);
        }
    };

    const handleSubmit = () => {
        const formatted = `${unit} ${Number(inputValue).toLocaleString()}`;
        onSubmit(formatted);
    };

    const formatLabel = (val: number) => {
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
        return val;
    };

    const [isHelpOpen, setIsHelpOpen] = useState(false);

    if (isHelpOpen) {
        return (
            <HelpChat
                contextData={contextData}
                stepInfo={stepInfo || "Amount Selection"}
                isOpen={true}
                onToggle={setIsHelpOpen}
            />
        );
    }

    return (
        <div className="animate-slide-up w-full max-w-md">
            <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 space-y-6">

                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">{label}</label>
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-semibold text-muted-foreground">{unit}</span>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-lg font-medium focus:ring-2 focus:ring-primary outline-none"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="pt-2 pb-6">
                        <Slider
                            value={[value]}
                            min={min}
                            max={max}
                            step={step}
                            onValueChange={handleSliderChange}
                            className="cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>{unit} {formatLabel(min)}</span>
                            <span>{unit} {formatLabel(max)}+</span>
                        </div>
                    </div>

                </div>

                <Button onClick={handleSubmit} size="lg" className="w-full text-base">
                    Continue
                </Button>
            </div>
            <HelpChat
                contextData={contextData}
                stepInfo={stepInfo || "Amount Selection"}
                isOpen={false}
                onToggle={setIsHelpOpen}
            />
        </div>
    );
}
