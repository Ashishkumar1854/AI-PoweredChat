// frontend/src/components/Chatbot.jsx
import { useState } from "react";
import { supabase } from "../services/supabase";

export default function Chatbot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      // 🔐 Get Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setAnswer("User not authenticated");
        setLoading(false);
        return;
      }

      // 🚀 Call Python backend
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setAnswer(data.answer || "No response received");
    } catch (err) {
      console.error(err);
      setAnswer("Something went wrong while contacting AI backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>🤖 AI Chatbot</h3>

      <form onSubmit={askAI}>
        <input
          placeholder="Ask about tasks, Excel, issues..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ width: "320px", padding: "8px" }}
        />
        <button type="submit" style={{ marginLeft: "8px" }}>
          Ask
        </button>
      </form>

      {loading && <p>Thinking...</p>}

      {answer && (
        <div style={{ marginTop: "10px", whiteSpace: "pre-line" }}>
          <b>Answer:</b>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
