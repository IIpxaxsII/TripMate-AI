import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={disabled ? "AI is responding..." : "Type your message..."}
        className="min-h-[44px] max-h-32 resize-none"
        rows={1}
        disabled={disabled}
      />
      <Button
        size="icon"
        variant="ghost"
        className="h-11 w-11 shrink-0"
        onClick={() => {}}
        disabled={disabled}
        aria-label="Voice input"
      >
        <Mic className="h-5 w-5" />
      </Button>
      <Button
        size="icon"
        className="h-11 w-11 shrink-0"
        onClick={handleSubmit}
        disabled={!input.trim() || disabled}
        aria-label="Send message"
      >
        {disabled ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};
