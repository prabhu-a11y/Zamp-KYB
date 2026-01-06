import React, { useState } from 'react';
import { AddressAutocomplete } from './AddressAutocomplete';
import { Button } from "@/components/ui/button";
import { X, Plus, Check } from "lucide-react";
import { HelpChat } from './HelpChat';

interface MultiAddressInputProps {
    onSubmit: (addresses: string[]) => void;
    contextData?: any;
    stepInfo?: string;
    initialData?: string[];
}

export const MultiAddressInput = ({ onSubmit, contextData, stepInfo, initialData = [] }: MultiAddressInputProps) => {
    const [addresses, setAddresses] = useState<string[]>(initialData);
    const [currentInput, setCurrentInput] = useState("");
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    // When a user selects from dropdown, we add it immediately? 
    // Or selecting puts it in the box and then they click "Add"?
    // "click a add another address button" -> Implies Add button.

    const handleSelect = (val: string) => {
        setCurrentInput(val);
    };

    const handleAdd = () => {
        if (currentInput && !addresses.includes(currentInput)) {
            setAddresses([...addresses, currentInput]);
            setCurrentInput(""); // Clear input to allow new search
            // Force reset of GoogleAddressInput? 
            // The component manages its own state 'value'. 
            // We might need to key the component to reset it.
        }
    };

    const handeRemove = (addr: string) => {
        setAddresses(addresses.filter(a => a !== addr));
    };

    const handleDone = () => {
        onSubmit(addresses);
    };

    if (isHelpOpen) {
        return (
            <HelpChat
                contextData={contextData}
                stepInfo={stepInfo || "Multi Address Input"}
                isOpen={true}
                onToggle={() => setIsHelpOpen(false)}
            />
        );
    }

    return (
        <div className="w-full max-w-md animate-slide-up space-y-4">
            <div className="space-y-3">
                {addresses.map((addr, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200">
                        <span className="text-sm text-gray-700 truncate flex-1 mr-2">{addr}</span>
                        <button onClick={() => handeRemove(addr)} className="text-red-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 items-start">
                <div className="flex-1">
                    <AddressAutocomplete
                        onSelect={handleSelect}
                        placeholder="Search country or city..."
                    />
                </div>
                <Button onClick={handleAdd} disabled={!currentInput} variant="secondary" size="icon" className="h-[38px] w-[38px] shrink-0 mt-[2px]">
                    <Plus size={20} />
                </Button>
            </div>

            <div className="pt-2">
                <Button onClick={handleDone} className="w-full" size="lg" disabled={addresses.length === 0}>
                    Confirm & Continue <ArrowRight size={16} className="ml-2" /> {/* ArrowRight usage needs import or inline */}
                </Button>
            </div>

            <HelpChat
                contextData={contextData}
                stepInfo={stepInfo || "Multi Address Input"}
                isOpen={false}
                onToggle={setIsHelpOpen}
            />
        </div>
    );
};

// Fix missing import
import { ArrowRight } from "lucide-react";
