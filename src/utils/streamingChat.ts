/**
 * Streaming chat utilities for TripMate AI
 */

const CHAT_STREAM_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat-stream`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StreamChatOptions {
  messages: ChatMessage[];
  conversationId: string;
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError: (error: Error) => void;
  signal?: AbortSignal;
}

export async function streamChat({
  messages,
  conversationId,
  onDelta,
  onDone,
  onError,
  signal
}: StreamChatOptions): Promise<void> {
  try {
    // Get the auth token from Supabase
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(CHAT_STREAM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ messages, conversationId }),
      signal
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment before sending another message.');
      }
      if (response.status === 402) {
        throw new Error('AI credits exhausted. Please contact support.');
      }
      
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      // Process line by line
      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        // Handle CRLF
        if (line.endsWith('\r')) {
          line = line.slice(0, -1);
        }

        // Skip empty lines and SSE comments
        if (line.startsWith(':') || line.trim() === '') {
          continue;
        }

        // Parse SSE data lines
        if (!line.startsWith('data: ')) {
          continue;
        }

        const jsonStr = line.slice(6).trim();
        
        if (jsonStr === '[DONE]') {
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          
          if (content) {
            onDelta(content);
          }
        } catch (e) {
          // Incomplete JSON, put back in buffer
          buffer = line + '\n' + buffer;
          break;
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim()) {
      const lines = buffer.split('\n');
      for (const rawLine of lines) {
        let line = rawLine.trim();
        if (!line || line.startsWith(':')) continue;
        if (!line.startsWith('data: ')) continue;
        
        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') continue;
        
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          // Ignore parse errors on final flush
        }
      }
    }

    onDone();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      onDone();
      return;
    }
    onError(error instanceof Error ? error : new Error('Unknown streaming error'));
  }
}
