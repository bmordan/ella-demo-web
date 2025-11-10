import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  preferences: {
    dietary_requirements: string[];
    food_preferences: string[];
  };
}

interface UserContextType {
  users: User[];
  selectedUser: User | null;
  selectUser: (user: User) => void;
  unselectUser: () => void;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:7777/users');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }
        
        const data = await response.json();
        const users = data.map((user: { user_id: string; preferences: string; name: string }) => ({
          id: user.user_id,
          name: user.name,
          preferences: JSON.parse(user.preferences)
        }));
        setUsers(users);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const selectUser = useCallback((user: User) => {
    console.log('selectUser called with:', user);
    setSelectedUser(user);
  }, []);

  const unselectUser = useCallback(() => {
    console.log('unselectUser called');
    setSelectedUser(null);
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        selectedUser,
        selectUser,
        unselectUser,
        loading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

