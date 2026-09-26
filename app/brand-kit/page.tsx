"use client";

import { useSession } from "@/lib/session-store";

const FONTS = ["Georgia", "Helvetica", "Times New Roman", "Courier New"];

export default function BrandKitPage() {
  const { brandKit, setBrandKit } = useSession();

  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-3xl text-kraft-gold mb-6">Brand Kit</h1>
      <p className="text-sm opacity-70 mb-6">
        Set this once — it's applied across every template in the editor automatically.
      </p>

      <div className="card p-5 space-y-4">
        <div>
          <label className="block text-xs opacity-60 mb-1">Logo text</label>
          <input
            value={brandKit.logoText}
            onChange={(e) => setBrandKit({ ...brandKit, logoText: e.target.value })}
            className="w-full bg-transparent border border-kraft-line rounded px-2 py-1.5 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs opacity-60 mb-1">Primary color</label>
            <input
              type="color"
              value={brandKit.primaryColor}
              onChange={(e) => setBrandKit({ ...brandKit, primaryColor: e.target.value })}
              className="w-full h-10 bg-transparent border border-kraft-line rounded"
            />
          </div>
          <div>
            <label className="block text-xs opacity-60 mb-1">Accent color</label>
            <input
              type="color"
              value={brandKit.accentColor}
              onChange={(e) => setBrandKit({ ...brandKit, accentColor: e.target.value })}
              className="w-full h-10 bg-transparent border border-kraft-line rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs opacity-60 mb-1">Font</label>
          <select
            value={brandKit.font}
            onChange={(e) => setBrandKit({ ...brandKit, font: e.target.value })}
            className="w-full bg-kraft-panel border border-kraft-line rounded px-2 py-1.5 text-sm"
          >
            {FONTS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <p className="text-[11px] opacity-40">
          In production, save this to a `brand_kits` table in Supabase keyed by user id, instead of the in-memory session store.
        </p>
      </div>
    </div>
  );
}
