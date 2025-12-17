// frontend/src/components/Chatbot.jsx
import { useState } from "react";
import { supabase } from "../services/supabase";

export default function Chatbot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async (e) => {
    e.preventDefault();

    // ✅ 1️⃣ Empty question guard
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/company-chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ question }),
      }
    );

    const data = await res.json();
    setAnswer(data.answer || "No response");
    setLoading(false);
  };

  return (
    <div>
      <h3>AI Chatbot</h3>

      <form onSubmit={askAI}>
        <input
          placeholder="Ask something..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ width: "300px" }}
        />
        <button type="submit">Ask</button>
      </form>

      {loading && <p>Thinking...</p>}
      {answer && (
        <p>
          <b>Answer:</b> {answer}
        </p>
      )}
    </div>
  );
}
