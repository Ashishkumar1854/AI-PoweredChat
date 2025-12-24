// // src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import Chatbot from "../components/Chatbot";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [company, setCompany] = useState("");
  const [companyId, setCompanyId] = useState(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not logged in");

      const { data: rows } = await supabase
        .from("users")
        .select("company_id, companies(name)")
        .eq("id", user.id);

      const row = rows[0];
      setCompany(row.companies.name);
      setCompanyId(row.company_id);

      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("company_id", row.company_id)
        .order("created_at", { ascending: false });

      setTasks(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createTask(e) {
    e.preventDefault();
    if (!title || !companyId) return;

    await supabase.from("tasks").insert({
      title,
      status,
      company_id: companyId,
    });

    setTitle("");
    setStatus("pending");
    loadDashboard();
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) return <p>Loading....</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>
      <p style={styles.company}>Company: {company}</p>

      <button onClick={logout} style={styles.logout}>
        Logout
      </button>

      <div style={styles.card}>
        <h3>Create Task</h3>
        <form onSubmit={createTask} style={styles.form}>
          <input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={styles.select}
          >
            <option value="pending">pending</option>
            <option value="in_progress">in_progress</option>
            <option value="done">done</option>
          </select>
          <button type="submit" style={styles.button}>
            Create
          </button>
        </form>
      </div>

      <Chatbot />

      <div style={styles.card}>
        <h3>Your Tasks</h3>
        {tasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          <ul style={styles.list}>
            {tasks.map((t) => (
              <li key={t.id} style={styles.task}>
                <strong>{t.title}</strong>
                <span style={styles.badge}>{t.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "4px",
  },
  company: {
    color: "#4b5563",
  },
  logout: {
    marginBottom: "20px",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    background: "#ef4444",
    color: "#fff",
    cursor: "pointer",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "16px",
    marginTop: "20px",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
  },
  select: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
  },
  button: {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
  list: {
    marginTop: "10px",
    paddingLeft: "0",
    listStyle: "none",
  },
  task: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  badge: {
    background: "#e0e7ff",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
  },
};
