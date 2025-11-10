import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

export interface Conversation {
  id: string;
  user_id: string;
  timestamp: string;
  content: [string | null, string | null];
}

interface ConversationContextType {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  submitQuery: (query: string) => Promise<void>;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

interface ConversationProviderProps {
  children: ReactNode;
  user_id: string;
}

export function ConversationProvider({ children, user_id }: ConversationProviderProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!user_id) {
      setConversations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:7777/ai/${user_id}/conversations`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch conversations: ${response.statusText}`);
      }
      
      const data = await response.json();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching conversations:', err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  const submitQuery = useCallback(async (query: string) => {
    setLoading(true);
    if (!user_id) {
      throw new Error('User ID is required to submit a query');
    }

    try {
      setError(null);
      const response = await fetch(`http://localhost:7777/ai/${user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to submit query: ${response.statusText}`);
      }
      
      // Refetch conversations after successful submission
      await fetchConversations();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error submitting query:', err);
    } finally {
      setLoading(false);
    }
  }, [user_id, fetchConversations]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        loading,
        error,
        refetch: fetchConversations,
        submitQuery,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
}

