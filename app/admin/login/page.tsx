"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-kraft-bg">
      <form onSubmit={handleSubmit} className="card p-6 w-80">
        <h1 className="font-serif text-2xl text-kraft-gold mb-1">Kraft Admin</h1>
        <p className="text-xs opacity-60 mb-5">Restricted access.</p>

        <label className="block text-xs opacity-60 mb-1">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border border-kraft-line rounded px-3 py-2 mb-3 text-sm"
          autoComplete="username"
        />

        <label className="block text-xs opacity-60 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border border-kraft-line rounded px-3 py-2 mb-4 text-sm"
          autoComplete="current-password"
        />

        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

        <button disabled={loading} className="btn-gold w-full py-2 rounded-full disabled:opacity-50">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
