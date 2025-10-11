import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI travel assistant. How can I help you plan your next adventure?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    
    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'd be happy to help you with that! Let me find the best options for you.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-7rem)] max-w-4xl mx-auto">
        <div className="p-4 border-b bg-card">
          <h1 className="text-2xl font-bold text-foreground">AI Travel Assistant</h1>
          <p className="text-sm text-muted-foreground">Ask me anything about your travel plans</p>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                text={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={scrollRef} />
          </div>
        </div>

        {messages.length === 1 && (
          <div className="px-4 pb-4">
            <SuggestedPrompts onPromptClick={handlePromptClick} />
          </div>
        )}

        <div className="p-4 border-t bg-card">
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </MainLayout>
  );
}
