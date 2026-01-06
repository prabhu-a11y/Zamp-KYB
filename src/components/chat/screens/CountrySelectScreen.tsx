import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { HelpChat } from "./HelpChat";

const COUNTRIES = [
  "United States", "United Kingdom", "Germany", "France", "India",
  "China", "Japan", "Australia", "Canada", "Singapore",
  "United Arab Emirates", "Saudi Arabia", "Qatar", "Bahrain", "Kuwait", "Oman",
  "South Africa", "Egypt", "Jordan", "Lebanon", "Pakistan", "Bangladesh"
];

interface CountrySelectScreenProps {
  onSubmit: (countries: string[]) => void;
  contextData?: any;
  stepInfo?: string;
}

export function CountrySelectScreen({ onSubmit, contextData, stepInfo }: CountrySelectScreenProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  if (isHelpOpen) {
    return <HelpChat isOpen={true} onToggle={() => setIsHelpOpen(false)} contextData={contextData} stepInfo={stepInfo} />;
  }

  const filteredCountries = COUNTRIES.filter(c =>
    c.toLowerCase().includes(search.toLowerCase()) && !selected.includes(c)
  );

  const addCountry = (country: string) => {
    setSelected(prev => [...prev, country]);
    setSearch("");
  };

  const removeCountry = (country: string) => {
    setSelected(prev => prev.filter(c => c !== country));
  };

  const handleSubmit = () => {
    if (selected.length > 0) {
      onSubmit(selected);
    }
  };

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selected.map((country) => (
              <Badge key={country} variant="secondary" className="gap-1 text-sm py-1.5 px-3">
                {country}
                <button onClick={() => removeCountry(country)}>
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search countries..."
          className="w-full px-4 py-3 border border-border rounded-xl text-base bg-background"
        />
        {search && filteredCountries.length > 0 && (
          <div className="max-h-48 overflow-y-auto space-y-1">
            {filteredCountries.slice(0, 5).map((country) => (
              <button
                key={country}
                onClick={() => addCountry(country)}
                className="w-full text-left px-4 py-3 text-base hover:bg-muted rounded-lg"
              >
                {country}
              </button>
            ))}
          </div>
        )}
      </div>
      <Button onClick={handleSubmit} disabled={selected.length === 0} size="lg" className="w-full text-base">
        Continue
      </Button>
      <HelpChat isOpen={false} onToggle={() => setIsHelpOpen(true)} contextData={contextData} stepInfo={stepInfo} />
    </div>
  );
}
