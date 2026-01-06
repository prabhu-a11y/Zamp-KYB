import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface OptionCardProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  selected?: boolean;
  onClick: () => void;
}

export const OptionCard = ({
  icon: Icon,
  label,
  description,
  selected,
  onClick,
}: OptionCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-5 rounded-xl border text-left transition-all duration-200",
        "hover:border-primary/50 hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        selected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border bg-card"
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
            selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("font-medium text-base", selected && "text-primary")}>
            {label}
          </p>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        <div
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
            selected ? "border-primary bg-primary" : "border-muted-foreground"
          )}
        >
          {selected && (
            <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
          )}
        </div>
      </div>
    </button>
  );
};
