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
    <div style={styles.card}>
      <h3 style={styles.heading}>🤖 AI Assistant</h3>

      <form onSubmit={askAI} style={styles.form}>
        <input
          placeholder="Ask about your tasks..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Ask
        </button>
      </form>

      {loading && <p style={styles.loading}>Thinking...</p>}

      {answer && (
        <div style={styles.answerBox}>
          <strong>Answer</strong>
          <p style={styles.answerText}>{answer}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "16px",
    marginTop: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  heading: {
    marginBottom: "10px",
    color: "#111827",
  },
  form: {
    display: "flex",
    gap: "8px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    outline: "none",
  },
  button: {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
  loading: {
    marginTop: "10px",
    color: "#6b7280",
    fontStyle: "italic",
  },
  answerBox: {
    marginTop: "14px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "12px",
  },
  answerText: {
    marginTop: "6px",
    whiteSpace: "pre-line",
    color: "#111827",
  },
};
