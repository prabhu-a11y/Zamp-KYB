import { cn } from "@/lib/utils";
import paceLogo from "@/assets/pace-logo.png";

interface PaceAvatarProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const PaceAvatar = ({ className, size = "md" }: PaceAvatarProps) => {
  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden shadow-sm",
        sizeClasses[size],
        className
      )}
    >
      <img 
        src={paceLogo} 
        alt="Pace" 
        className="w-full h-full object-cover"
      />
    </div>
  );
};