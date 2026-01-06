import { ArrowLeft } from "lucide-react";

interface BackLinkProps {
  onClick: () => void;
}

export function BackLink({ onClick }: BackLinkProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Go back</span>
    </button>
  );
}
