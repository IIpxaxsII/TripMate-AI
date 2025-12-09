import React, { useState, useRef, useEffect, useCallback } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { streamChat, ChatMessage } from "@/utils/streamingChat";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
}

// Debounce to prevent rapid-fire messages
const SEND_COOLDOWN_MS = 2000;

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your AI travel assistant. How can I help you plan your next adventure?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());
  const [lastSendTime, setLastSendTime] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user, conversationId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

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
        setMessages((prev) => [prev[0], ...loadedMessages]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = useCallback(async (text: string) => {
    // Client-side rate limiting
    const now = Date.now();
    if (now - lastSendTime < SEND_COOLDOWN_MS) {
      toast({
        variant: "destructive",
        title: "Please wait",
        description: "You're sending messages too quickly. Please wait a moment.",
      });
      return;
    }
    setLastSendTime(now);

    // Cancel any ongoing stream
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Create a placeholder for the assistant message
    const assistantId = `assistant-${Date.now()}`;
    let assistantText = '';

    // Prepare messages for API (exclude welcome message)
    const apiMessages: ChatMessage[] = [...messages.slice(1), userMessage]
      .map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));

    try {
      await streamChat({
        messages: apiMessages,
        conversationId,
        signal: abortControllerRef.current.signal,
        onDelta: (delta) => {
          assistantText += delta;
          setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg?.id === assistantId) {
              // Update existing assistant message
              return prev.map((m, i) => 
                i === prev.length - 1 
                  ? { ...m, text: assistantText, isStreaming: true }
                  : m
              );
            } else {
              // Create new assistant message
              return [...prev, {
                id: assistantId,
                text: assistantText,
                isUser: false,
                timestamp: new Date(),
                isStreaming: true,
              }];
            }
          });
        },
        onDone: () => {
          setIsTyping(false);
          setMessages((prev) => 
            prev.map(m => 
              m.id === assistantId 
                ? { ...m, isStreaming: false }
                : m
            )
          );

          // Save messages to database
          if (assistantText) {
            saveMessages(text, assistantText);
          }
        },
        onError: (error) => {
          setIsTyping(false);
          console.error('Streaming error:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "Failed to get response. Please try again.",
          });
        }
      });
    } catch (error) {
      setIsTyping(false);
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    }
  }, [messages, conversationId, lastSendTime]);

  const saveMessages = async (userContent: string, assistantContent: string) => {
    if (!user) return;
    
    try {
      await supabase.from('chat_messages').insert([
        {
          user_id: user.id,
          conversation_id: conversationId,
          role: 'user',
          content: userContent,
        },
        {
          user_id: user.id,
          conversation_id: conversationId,
          role: 'assistant',
          content: assistantContent,
        }
      ]);
    } catch (error) {
      console.error('Error saving messages:', error);
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
                isStreaming={message.isStreaming}
              />
            ))}
            {isTyping && messages[messages.length - 1]?.isUser && <TypingIndicator />}
            <div ref={scrollRef} />
          </div>
        </div>

        {messages.length === 1 && (
          <div className="px-4 pb-4">
            <SuggestedPrompts onPromptClick={handlePromptClick} />
          </div>
        )}

        <div className="p-4 border-t bg-card">
          <ChatInput onSend={handleSendMessage} disabled={isTyping} />
        </div>
      </div>
    </MainLayout>
  );
}
