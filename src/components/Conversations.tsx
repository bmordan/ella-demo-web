import { useEffect, useRef } from "react";
import { useConversation } from "../contexts/conversation";
import { useUser } from "../contexts/user";
import Thinking from "./Thinking";

export const Conversations = () => {
    const { selectedUser, unselectUser } = useUser();
    const { conversations, loading, error, submitQuery } = useConversation();
    const messagesEndRef = useRef<HTMLUListElement>(null);
    
    if (!selectedUser) return null;
    if (error) return <div>Error: {error}</div>;

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [conversations, loading]);

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
        <section className="bg-amber-50 min-h-screen bg-image-food">
          <header className="p-4 flex justify-between items-center relative z-2">
            <h1 className="font-serif text-center text-shadow-sm text-2xl font-bold text-sky-900 px-4 py-2 rounded-md bg-sky-100 outline outline-sky-900">{selectedUser.name}</h1>
            <button 
            onClick={() => unselectUser()}
            className="bg-amber-500 text-white px-4 py-2 rounded-md shadow-sm">Change User</button>
          </header>
          <main className="mt-8 relative z-2">
            <ul ref={messagesEndRef} className="space-y-2 max-w-120 mx-auto bg-amber-100 rounded-md p-4 max-h-[73vh] overflow-y-auto scroll-smooth">
              {conversations.map((convo,i) => {
                const [query, response] = convo.content;
                return (
                  <li key={convo.id+i} className="mb-2 w-full">
                    <p className="bg-sky-900 text-white p-2 rounded-md mb-2 ml-25">{query}</p>
                    <p className="bg-sky-700 text-white p-2 rounded-md mr-25">{response}</p>
                  </li>
                )
              })}
            </ul>
          </main>
          <footer className="pb-4 relative z-2">
            {loading ? <Thinking /> : (
              <form className="space-y-2 max-w-120 mx-auto my-4 flex" onSubmit={handleSubmit}>
                  <input className="w-full bg-white p-2 rounded-md outline outline-amber-500 px-4 py-2 mb-0" type="text" placeholder="Ask Ella a question" name="query" />
                  <button type="submit" className="bg-amber-500 shadow-sm text-white px-4 py-2 rounded-md ml-2">Ask</button>
              </form>
            )}
          </footer>
        </section>
      )
}