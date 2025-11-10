import { useConversation } from "../contexts/conversation";
import { useUser } from "../contexts/user";
import Thinking from "./Thinking";

export const Conversations = () => {
    const { selectedUser, unselectUser } = useUser();
    const { conversations, loading, error, submitQuery } = useConversation();
    if (!selectedUser) return null;
    if (error) return <div>Error: {error}</div>;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const query = formData.get("query") as string;
        if (!query.trim()) return;
        
        try {
            await submitQuery(query);
            (e.target as HTMLFormElement).reset();
        } catch (err) {
            console.error('Failed to submit query:', err);
        }
    }

    return (
        <section>
          <header>
            <button onClick={() => unselectUser()}>Change User</button>
          </header>
          <main>
            <h1>Hello {selectedUser.name}</h1>
            <ul>
              {conversations.map((convo,i) => {
                const [query, response] = convo.content;
                return (
                  <li key={convo.id+i}>
                    <p><u>{query}</u></p>
                    <p>{response}</p>
                  </li>
                )
              })}
            </ul>
          </main>
          <footer>
            {loading ? <Thinking /> : (
              <form onSubmit={handleSubmit}>
                  <input type="text" placeholder="Ask Ella a question" name="query" />
                  <button type="submit">Ask</button>
              </form>
            )}
          </footer>
        </section>
      )
}