import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check } from "lucide-react";
import { HelpChat } from "./HelpChat";

interface Field {
  key: string;
  label: string;
  value: string;
}

interface ExtractionConfirmScreenProps {
  fields: Field[];
  onConfirm: (fields: Field[]) => void;
  contextData?: any;
  stepInfo?: string;
  title?: string;
}

export function ExtractionConfirmScreen({ fields: initialFields, onConfirm, contextData, stepInfo, title = "Verification Successful" }: ExtractionConfirmScreenProps) {
  const [fields, setFields] = useState(initialFields);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  if (isHelpOpen) {
    return <HelpChat isOpen={true} onToggle={() => setIsHelpOpen(false)} contextData={contextData} stepInfo={stepInfo} />;
  }

  const handleFieldChange = (key: string, value: string) => {
    setFields(prev => prev.map(f => f.key === key ? { ...f, value } : f));
  };

  const handleConfirm = () => {
    onConfirm(fields);
  };

  return (
    <div className="animate-slide-up">
      <div className="border border-blue-500/30 bg-blue-950/10 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Check className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-blue-400">{title}</h3>
        </div>

        <div className="p-5 pt-2 space-y-4">
          {/* Inner Dark Card */}
          <div className="bg-card/50 border border-white/5 rounded-lg p-5 space-y-5">
            {fields.map((field) => (
              <div key={field.key} className="group">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{field.label}</p>
                <div className="flex items-center justify-between gap-4">
                  {editingField === field.key ? (
                    <div className="flex items-center gap-2 flex-1 animate-fade-in">
                      <Input
                        value={field.value}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="h-9 text-base bg-background/50"
                        autoFocus
                      />
                      <button
                        onClick={() => setEditingField(null)}
                        className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center hover:bg-blue-500/30 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-base font-medium text-foreground">{field.value}</span>
                      <button
                        onClick={() => setEditingField(field.key)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-blue-400"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleConfirm}
            size="lg"
            className="w-full text-base bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
          >
            Confirm & Continue
          </Button>
        </div>
      </div>
      <HelpChat isOpen={false} onToggle={() => setIsHelpOpen(true)} contextData={contextData} stepInfo={stepInfo} />
    </div >
  );
}
