import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface SuggestedPromptsProps {
  onPromptClick: (prompt: string) => void;
}

const prompts = [
  "Plan a weekend getaway to the mountains",
  "Suggest romantic destinations in Europe",
  "Find budget-friendly beach destinations",
  "Recommend adventure activities in Asia",
];

export const SuggestedPrompts = ({ onPromptClick }: SuggestedPromptsProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        <span>Try asking:</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {prompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            className="justify-start text-left h-auto py-3 px-4 hover:bg-accent"
            onClick={() => onPromptClick(prompt)}
          >
            <span className="text-sm">{prompt}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
