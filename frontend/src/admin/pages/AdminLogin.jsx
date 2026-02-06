import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Optional extra safety: check role
      if (data.user.role !== "admin") {
        alert("Not an admin account");
        return;
      }

      navigate("/admin/dashboard");
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 space-y-4">
        <h1 className="text-xl font-semibold">Admin Login</h1>

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full rounded-xl bg-gray-800 px-3 py-2 text-sm outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-xl bg-gray-800 px-3 py-2 text-sm outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
