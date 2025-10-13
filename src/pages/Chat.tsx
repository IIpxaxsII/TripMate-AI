import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { measurePerformance } from "@/utils/performanceOptimization";

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
  const [conversationId] = useState(() => crypto.randomUUID());
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    // Load previous messages for this conversation
    if (user) {
      loadMessages();
    }
  }, [user, conversationId]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const loadedMessages: Message[] = data.map((msg) => ({
          id: msg.id,
          text: msg.content,
          isUser: msg.role === 'user',
          timestamp: new Date(msg.created_at),
        }));
        setMessages([...messages.slice(0, 1), ...loadedMessages]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);

    try {
      await measurePerformance('AI Chat Response', async () => {
        // Prepare messages for API (exclude the welcome message)
        const apiMessages = [...messages.slice(1), newMessage].map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        }));

        // Call the edge function
        const { data, error } = await supabase.functions.invoke('ai-chat', {
          body: {
            messages: apiMessages,
            conversationId
          }
        });

        if (error) throw error;

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.message,
          isUser: false,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiResponse]);
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsTyping(false);
    }
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
