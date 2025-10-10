import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim()) {
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
        placeholder="Type your message..."
        className="min-h-[44px] max-h-32 resize-none"
        rows={1}
      />
      <Button
        size="icon"
        variant="ghost"
        className="h-11 w-11 shrink-0"
        onClick={() => {}}
      >
        <Mic className="h-5 w-5" />
      </Button>
      <Button
        size="icon"
        className="h-11 w-11 shrink-0"
        onClick={handleSubmit}
        disabled={!input.trim()}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};
