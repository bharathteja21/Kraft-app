"use client";

import { useState } from "react";
import Link from "next/link";
import templates from "@/data/templates.json";
import { useSession } from "@/lib/session-store";

const categories = ["All", "Motion Intro", "Video Reel", "Graphic Carousel"];

export default function TemplatesPage() {
  const { plan } = useSession();
  const [category, setCategory] = useState("All");

  const visible = templates.filter((t) => category === "All" || t.category === category);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl text-kraft-gold">Templates</h1>
        <div className="flex gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={
                "px-3 py-1 rounded-full text-sm border " +
                (category === c ? "btn-gold border-transparent" : "border-kraft-line opacity-80")
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {visible.map((t) => {
          const locked = t.tier === "pro" && plan === "free";
          return (
            <Link
              key={t.id}
              href={locked ? "/billing" : `/editor/${t.id}`}
              className="card overflow-hidden hover:border-kraft-gold transition"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-kraft-line to-black flex items-center justify-center relative">
                <span className="font-serif text-kraft-gold/60 text-sm px-3 text-center">{t.name}</span>
                {t.tier === "pro" && (
                  <span className="pill absolute top-2 right-2 bg-kraft-gold text-black">
                    {locked ? "🔒 Pro" : "Pro"}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs opacity-60">{t.category} · {t.aspect}{t.durationSec ? ` · ${t.durationSec}s` : ""}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
