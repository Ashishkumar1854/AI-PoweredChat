// // src/pages/Dashboard.jsx
// import { useEffect, useState } from "react";
// import { supabase } from "../services/supabase";

// export default function Dashboard() {
//   const [tasks, setTasks] = useState([]);
//   const [company, setCompany] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     loadDashboard();
//   }, []);

//   const loadDashboard = async () => {
//     try {
//       // 1️⃣ Get logged-in auth user
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) throw new Error("Not logged in");

//       // 2️⃣ Fetch mapped user rows (NO .single())
//       const { data: userRows, error: userErr } = await supabase
//         .from("users")
//         .select("company_id, companies(name)")
//         .eq("id", user.id);

//       if (userErr) throw userErr;

//       // pick first mapped row
//       const userRow = userRows?.[0];

//       if (!userRow) {
//         throw new Error("User is not mapped to any company");
//       }

//       setCompany(userRow.companies.name);

//       // 3️⃣ Fetch company-wise tasks
//       const { data: tasksData, error: taskErr } = await supabase
//         .from("tasks")
//         .select("*")
//         .eq("company_id", userRow.company_id)
//         .order("created_at", { ascending: false });

//       if (taskErr) throw taskErr;

//       setTasks(tasksData);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     await supabase.auth.signOut();
//     window.location.href = "/login";
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <h3>Company: {company}</h3>

//       <button onClick={logout}>Logout</button>

//       <hr />

//       {tasks.length === 0 ? (
//         <p>No tasks</p>
//       ) : (
//         <ul>
//           {tasks.map((t) => (
//             <li key={t.id}>
//               <b>{t.title}</b> — {t.status}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // 1️⃣ Get logged-in auth user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // 2️⃣ Fetch mapped user rows (NO .single())
      const { data: userRows, error: userErr } = await supabase
        .from("users")
        .select("company_id, companies(name)")
        .eq("id", user.id);

      if (userErr) {
        console.error(userErr);
        return;
      }

      // pick first mapped row
      const userRow = userRows?.[0];

      // ✅ SAFE fallback (NO ERROR THROW)
      if (!userRow) {
        setCompany("Not Assigned");
        setTasks([]);
        return;
      }

      setCompany(userRow.companies.name);

      // 3️⃣ Fetch company-wise tasks
      const { data: tasksData, error: taskErr } = await supabase
        .from("tasks")
        .select("*")
        .eq("company_id", userRow.company_id)
        .order("created_at", { ascending: false });

      if (taskErr) {
        console.error(taskErr);
        return;
      }

      setTasks(tasksData || []);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <h3>Company: {company}</h3>

      <button onClick={logout}>Logout</button>

      <hr />

      {company === "Not Assigned" ? (
        <p style={{ color: "orange" }}>
          Your account is not assigned to any company yet.
        </p>
      ) : tasks.length === 0 ? (
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
