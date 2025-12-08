import { cn } from "@/lib/utils";

interface MoodChipProps {
  label: string;
  value: string;
  selected: boolean;
  onToggle: () => void;
}

export const MoodChip = ({ label, value, selected, onToggle }: MoodChipProps) => {
  return (
    <button
      role="button"
      aria-pressed={selected}
      aria-label={`Filter by ${value} mood`}
      onClick={onToggle}
      onKeyDown={(e) => { 
        if (e.key === 'Enter' || e.key === ' ') { 
          e.preventDefault(); 
          onToggle(); 
        } 
      }}
      className={cn(
        "px-4 py-2 rounded-full border whitespace-nowrap transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        selected 
          ? "bg-primary text-primary-foreground border-primary" 
          : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
};
