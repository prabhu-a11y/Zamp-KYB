import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check } from "lucide-react";
import { HelpChat } from "./HelpChat";

interface Shareholder {
  name: string;
  nationality: string;
  ownership: string;
}

interface ShareholderTableScreenProps {
  shareholders: Shareholder[];
  onConfirm: (shareholders: Shareholder[]) => void;
  contextData?: any;
  stepInfo?: string;
}

export function ShareholderTableScreen({ shareholders: initialShareholders, onConfirm, contextData, stepInfo }: ShareholderTableScreenProps) {
  const [shareholders, setShareholders] = useState(initialShareholders);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  if (isHelpOpen) {
    return <HelpChat isOpen={true} onToggle={() => setIsHelpOpen(false)} contextData={contextData} stepInfo={stepInfo} />;
  }

  const handleChange = (index: number, field: keyof Shareholder, value: string) => {
    setShareholders(prev => prev.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    ));
  };

  const handleConfirm = () => {
    onConfirm(shareholders);
  };

  return (
    <div className="max-w-2xl animate-slide-up space-y-4">
      <div className="bg-card border border-border rounded-xl overflow-hidden" style={{ boxShadow: 'var(--extraction-shadow)' }}>
        <table className="w-full text-base">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Name</th>
              <th className="text-left px-5 py-3 font-medium">Nationality</th>
              <th className="text-left px-5 py-3 font-medium">Ownership</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {shareholders.map((shareholder, index) => (
              <tr key={index} className="border-t border-border">
                {editingIndex === index ? (
                  <>
                    <td className="px-5 py-3">
                      <Input
                        value={shareholder.name}
                        onChange={(e) => handleChange(index, "name", e.target.value)}
                        className="h-10 text-base"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <Input
                        value={shareholder.nationality}
                        onChange={(e) => handleChange(index, "nationality", e.target.value)}
                        className="h-10 text-base"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <Input
                        value={shareholder.ownership}
                        onChange={(e) => handleChange(index, "ownership", e.target.value)}
                        className="h-10 text-base"
                      />
                    </td>
                    <td className="px-3">
                      <button onClick={() => setEditingIndex(null)} className="text-primary">
                        <Check className="h-5 w-5" />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-5 py-3">{shareholder.name}</td>
                    <td className="px-5 py-3">{shareholder.nationality}</td>
                    <td className="px-5 py-3">{shareholder.ownership}</td>
                    <td className="px-3">
                      <button
                        onClick={() => setEditingIndex(index)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button onClick={handleConfirm} size="lg" className="w-full text-base">
        Confirm & Continue
      </Button>
      <HelpChat isOpen={false} onToggle={() => setIsHelpOpen(true)} contextData={contextData} stepInfo={stepInfo} />
    </div >
  );
}
