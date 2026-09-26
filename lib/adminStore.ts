import templatesSeed from "@/data/templates.json";

export type AdminUser = {
  id: string;
  email: string;
  plan: "free" | "pro" | "studio";
  joined: string;
};

export type AdminTemplate = {
  id: string;
  name: string;
  category: string;
  tier: "free" | "pro";
  durationSec: number;
  aspect: string;
};

// Demo, in-memory only: resets on server restart. In production, replace
// both of these with real reads/writes against Supabase (`profiles` and a
// `templates` table) instead of module-level state.
type Store = { users: AdminUser[]; templates: AdminTemplate[] };

const globalForStore = globalThis as unknown as { __kraftAdminStore?: Store };

function seedUsers(): AdminUser[] {
  return [
    { id: "u1", email: "amara@creator.co", plan: "pro", joined: "2026-08-02" },
    { id: "u2", email: "leo@studiodrop.com", plan: "free", joined: "2026-08-14" },
    { id: "u3", email: "hana@glow.co", plan: "studio", joined: "2026-09-01" },
    { id: "u4", email: "devon@dailyclips.io", plan: "free", joined: "2026-09-10" },
  ];
}

if (!globalForStore.__kraftAdminStore) {
  globalForStore.__kraftAdminStore = {
    users: seedUsers(),
    templates: templatesSeed as AdminTemplate[],
  };
}

export const adminStore = globalForStore.__kraftAdminStore;
