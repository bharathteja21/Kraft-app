"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlanId } from "@/lib/plans";
import type { AdminUser, AdminTemplate } from "@/lib/adminStore";

type Tab = "overview" | "users" | "templates";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTemplate, setNewTemplate] = useState({ name: "", category: "Motion Intro", tier: "free", aspect: "9:16", durationSec: 4 });

  async function loadAll() {
    setLoading(true);
    const [uRes, tRes] = await Promise.all([fetch("/api/admin/users"), fetch("/api/admin/templates")]);
    const uData = await uRes.json();
    const tData = await tRes.json();
    setUsers(uData.users || []);
    setTemplates(tData.templates || []);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function updateUserPlan(id: string, plan: PlanId) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, plan } : u)));
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, plan }),
    });
  }

  async function toggleTemplateTier(id: string, tier: "free" | "pro") {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, tier } : t)));
    await fetch("/api/admin/templates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, tier }),
    });
  }

  async function deleteTemplate(id: string) {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    await fetch("/api/admin/templates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  async function addTemplate() {
    if (!newTemplate.name.trim()) return;
    const res = await fetch("/api/admin/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTemplate),
    });
    const data = await res.json();
    setTemplates((prev) => [...prev, data.template]);
    setNewTemplate({ name: "", category: "Motion Intro", tier: "free", aspect: "9:16", durationSec: 4 });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const proCount = users.filter((u) => u.plan !== "free").length;
  const mrr = users.reduce((sum, u) => sum + (u.plan === "pro" ? 19 : u.plan === "studio" ? 49 : 0), 0);

  return (
    <div className="min-h-screen bg-kraft-bg text-kraft-cream">
      <header className="border-b border-kraft-line flex items-center justify-between px-6 py-4">
        <div className="font-serif text-xl text-kraft-gold">KRAFT — Admin</div>
        <button onClick={logout} className="text-sm px-4 py-1.5 rounded-full border border-kraft-line hover:border-kraft-gold">
          Log out
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-6">
          {(["overview", "users", "templates"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={"px-4 py-1.5 rounded-full text-sm capitalize border " + (tab === t ? "btn-gold border-transparent" : "border-kraft-line opacity-80")}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm opacity-60">Loading…</p>
        ) : (
          <>
            {tab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-5">
                  <p className="text-xs opacity-60">Total users</p>
                  <p className="font-serif text-3xl text-kraft-gold">{users.length}</p>
                </div>
                <div className="card p-5">
                  <p className="text-xs opacity-60">Paying users (Pro + Studio)</p>
                  <p className="font-serif text-3xl text-kraft-gold">{proCount}</p>
                </div>
                <div className="card p-5">
                  <p className="text-xs opacity-60">Estimated MRR</p>
                  <p className="font-serif text-3xl text-kraft-gold">${mrr}</p>
                </div>
                <p className="text-[11px] opacity-40 md:col-span-3">
                  Demo data. Wire this to real Stripe + Supabase queries in production for live figures.
                </p>
              </div>
            )}

            {tab === "users" && (
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-kraft-line/40 text-left">
                    <tr>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Joined</th>
                      <th className="px-4 py-2">Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-t border-kraft-line">
                        <td className="px-4 py-2">{u.email}</td>
                        <td className="px-4 py-2 opacity-60">{u.joined}</td>
                        <td className="px-4 py-2">
                          <select
                            value={u.plan}
                            onChange={(e) => updateUserPlan(u.id, e.target.value as PlanId)}
                            className="bg-kraft-panel border border-kraft-line rounded px-2 py-1 text-sm"
                          >
                            <option value="free">Free</option>
                            <option value="pro">Pro</option>
                            <option value="studio">Studio</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "templates" && (
              <div>
                <div className="card p-4 mb-5">
                  <h3 className="font-serif text-kraft-gold mb-3">Add template</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <input
                      placeholder="Name"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                      className="bg-transparent border border-kraft-line rounded px-2 py-1 text-sm"
                    />
                    <select
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                      className="bg-kraft-panel border border-kraft-line rounded px-2 py-1 text-sm"
                    >
                      <option>Motion Intro</option>
                      <option>Video Reel</option>
                      <option>Graphic Carousel</option>
                    </select>
                    <select
                      value={newTemplate.tier}
                      onChange={(e) => setNewTemplate({ ...newTemplate, tier: e.target.value })}
                      className="bg-kraft-panel border border-kraft-line rounded px-2 py-1 text-sm"
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                    </select>
                    <input
                      placeholder="Aspect e.g. 9:16"
                      value={newTemplate.aspect}
                      onChange={(e) => setNewTemplate({ ...newTemplate, aspect: e.target.value })}
                      className="bg-transparent border border-kraft-line rounded px-2 py-1 text-sm"
                    />
                    <button onClick={addTemplate} className="btn-gold rounded px-3 py-1 text-sm">Add</button>
                  </div>
                </div>

                <div className="card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-kraft-line/40 text-left">
                      <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Category</th>
                        <th className="px-4 py-2">Aspect</th>
                        <th className="px-4 py-2">Tier</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {templates.map((t) => (
                        <tr key={t.id} className="border-t border-kraft-line">
                          <td className="px-4 py-2">{t.name}</td>
                          <td className="px-4 py-2 opacity-60">{t.category}</td>
                          <td className="px-4 py-2 opacity-60">{t.aspect}</td>
                          <td className="px-4 py-2">
                            <select
                              value={t.tier}
                              onChange={(e) => toggleTemplateTier(t.id, e.target.value as "free" | "pro")}
                              className="bg-kraft-panel border border-kraft-line rounded px-2 py-1 text-sm"
                            >
                              <option value="free">Free</option>
                              <option value="pro">Pro</option>
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <button onClick={() => deleteTemplate(t.id)} className="text-xs text-red-400 hover:underline">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
