"use client";

import { useState } from "react";
import { PLANS, PlanId } from "@/lib/plans";
import { useSession } from "@/lib/session-store";

export default function BillingPage() {
  const { plan, setPlan } = useSession();
  const [loading, setLoading] = useState<PlanId | null>(null);

  async function upgrade(target: PlanId) {
    if (target === "free") {
      setPlan("free");
      return;
    }
    setLoading(target);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: target }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Demo fallback: no Stripe keys configured yet, so just flip the
        // in-memory plan so the rest of the app can be clicked through.
        setPlan(target);
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-kraft-gold mb-6">Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(Object.keys(PLANS) as PlanId[]).map((id) => {
          const p = PLANS[id];
          const current = plan === id;
          return (
            <div key={id} className={"card p-5 " + (current ? "border-kraft-gold" : "")}>
              <h3 className="font-serif text-xl text-kraft-gold">{p.name}</h3>
              <p className="text-2xl my-2">{p.price}</p>
              <ul className="text-sm space-y-1.5 opacity-80 mb-5">
                {p.features.map((f) => <li key={f}>• {f}</li>)}
              </ul>
              <button
                disabled={current || loading === id}
                onClick={() => upgrade(id)}
                className="btn-gold w-full py-2 rounded-full disabled:opacity-40"
              >
                {current ? "Current plan" : loading === id ? "Redirecting…" : `Choose ${p.name}`}
              </button>
            </div>
          );
        })}
      </div>
      <p className="text-xs opacity-40 mt-6">
        Stripe Checkout activates once STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PRICE_ID_PRO are set — until then, this page flips the demo plan locally so you can preview gated features.
      </p>
    </div>
  );
}
