import './App.css'
import { Conversations } from './components/Conversations';
import { SelectUser } from './components/SelectUser';
import { ConversationProvider } from './contexts/conversation';
import { useUser } from './contexts/user';

function App() {
  const { selectedUser, loading } = useUser();
  
  if (loading) return <div>Loading...</div>;
  if (!selectedUser) return <SelectUser />;

  return (
    <ConversationProvider user_id={selectedUser.id}>
      <Conversations />
    </ConversationProvider>
  );
}

export default App
