// src/pages/Login.jsx
import { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/dashboard");
    }
  };

  // SIGNUP
  const handleSignup = async () => {
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) setError(error.message);
    else alert("Signup successful! Now login.");
  };

  return (
    <div>
      <h1>LOGIN</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      <button onClick={handleSignup}>Signup</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
