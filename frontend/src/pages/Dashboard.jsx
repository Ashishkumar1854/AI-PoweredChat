// src/pages/Dashboard.jsx
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

      // 🔐 company mapping
      const { data: rows, error } = await supabase
        .from("users")
        .select("company_id, companies(name)")
        .eq("id", user.id);

      if (error || !rows?.length) {
        throw new Error("User not mapped to company");
      }

      const row = rows[0];
      setCompany(row.companies.name);
      setCompanyId(row.company_id);

      // company-wise tasks
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

    const { error } = await supabase.from("tasks").insert({
      title,
      status,
      company_id: companyId,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setStatus("pending");
    loadDashboard();
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <h3>Company: {company}</h3>

      <button onClick={logout}>Logout</button>

      <hr />

      {/* CREATE TASK */}
      <h3>Create Task</h3>
      <form onSubmit={createTask}>
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">pending</option>
          <option value="in_progress">in_progress</option>
          <option value="done">done</option>
        </select>
        <button type="submit">Create</button>
      </form>

      <hr />

      {/* 🤖 AI CHATBOT */}
      <Chatbot />

      <hr />

      {/* TASK LIST */}
      {tasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
        <ul>
          {tasks.map((t) => (
            <li key={t.id}>
              <b>{t.title}</b> — {t.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
