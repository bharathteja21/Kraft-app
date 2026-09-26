"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session-store";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const { setEmail } = useSession();
  const [value, setValue] = useState("");
  const router = useRouter();

  async function handleSignIn() {
    if (!value.trim()) return;
    if (isSupabaseConfigured) {
      // Real magic-link flow once Supabase env vars are set.
      await supabase.auth.signInWithOtp({ email: value });
    }
    setEmail(value);
    router.push("/");
  }

  return (
    <div className="max-w-sm mx-auto card p-6">
      <h1 className="font-serif text-2xl text-kraft-gold mb-4">Sign in to Kraft</h1>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="you@email.com"
        className="w-full bg-transparent border border-kraft-line rounded px-3 py-2 mb-4 text-sm"
      />
      <button onClick={handleSignIn} className="btn-gold w-full py-2 rounded-full">
        Continue
      </button>
      <p className="text-[11px] opacity-40 mt-3">
        {isSupabaseConfigured
          ? "Sends a magic link via Supabase Auth."
          : "Demo mode: no Supabase keys set yet, so this just stores your email locally for this session."}
      </p>
    </div>
  );
}
