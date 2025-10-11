import { Bot } from "lucide-react";

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="h-8 w-8 mt-1 rounded-full bg-secondary flex items-center justify-center">
        <Bot className="h-4 w-4 text-secondary-foreground" />
      </div>
      
      <div className="flex items-center gap-1 bg-secondary rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="w-2 h-2 bg-secondary-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-secondary-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-secondary-foreground/60 rounded-full animate-bounce" />
      </div>
    </div>
  );
};
