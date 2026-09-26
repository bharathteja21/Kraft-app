"use client";

import { useState } from "react";
import templates from "@/data/templates.json";
import { useSession } from "@/lib/session-store";

const MOCK_TRACKS = [
  { id: "t1", name: "Golden Afternoon", mood: "Uplifting", bpm: 110 },
  { id: "t2", name: "Quiet Confidence", mood: "Calm", bpm: 85 },
  { id: "t3", name: "City Lights", mood: "Energetic", bpm: 128 },
];

export default function EditorPage({ params }: { params: { id: string } }) {
  const template = templates.find((t) => t.id === params.id) || templates[0];
  const { plan, brandKit } = useSession();
  const [headline, setHeadline] = useState("Your headline here");
  const [subhead, setSubhead] = useState("A short supporting line");
  const [track, setTrack] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState<string | null>(null);

  const isPro = plan !== "free";

  async function handleExport() {
    setExporting(true);
    setExported(null);
    // In production this calls a Remotion Lambda render job (or a local
    // Remotion render for Free/dev mode) and returns a signed download URL.
    await new Promise((r) => setTimeout(r, 1500));
    setExporting(false);
    setExported(isPro ? "kraft-export-1080p.mp4" : "kraft-export-720p-watermarked.mp4");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
      <div>
        <h1 className="font-serif text-2xl text-kraft-gold mb-1">{template.name}</h1>
        <p className="text-xs opacity-60 mb-6">{template.category} · {template.aspect}</p>

        <div
          className="mx-auto card flex flex-col items-center justify-center text-center p-8"
          style={{
            width: 280,
            aspectRatio: template.aspect.replace(":", "/"),
            background: `linear-gradient(160deg, ${brandKit.primaryColor}22, #000)`,
            border: `1px solid ${brandKit.primaryColor}55`,
          }}
        >
          <p className="text-xs tracking-widest mb-2" style={{ color: brandKit.primaryColor, fontFamily: brandKit.font }}>
            {brandKit.logoText.toUpperCase()}
          </p>
          <h2 className="font-serif text-xl" style={{ fontFamily: brandKit.font }}>{headline}</h2>
          <p className="text-sm opacity-70 mt-2">{subhead}</p>
          {!isPro && (
            <span className="absolute bottom-3 right-3 text-[10px] opacity-40">kraft.app</span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="card p-4">
          <h3 className="font-serif text-kraft-gold mb-3">Edit fields</h3>
          <label className="block text-xs opacity-60 mb-1">Headline</label>
          <input value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full bg-transparent border border-kraft-line rounded px-2 py-1 mb-3 text-sm" />
          <label className="block text-xs opacity-60 mb-1">Subheading</label>
          <input value={subhead} onChange={(e) => setSubhead(e.target.value)} className="w-full bg-transparent border border-kraft-line rounded px-2 py-1 text-sm" />
        </div>

        <div className="card p-4">
          <h3 className="font-serif text-kraft-gold mb-3">
            Music {!isPro && <span className="pill bg-kraft-line ml-2">Pro</span>}
          </h3>
          {isPro ? (
            <div className="space-y-2">
              {MOCK_TRACKS.map((tr) => (
                <button
                  key={tr.id}
                  onClick={() => setTrack(tr.id)}
                  className={"w-full text-left text-sm px-3 py-2 rounded border " + (track === tr.id ? "border-kraft-gold" : "border-kraft-line")}
                >
                  {tr.name} <span className="opacity-50 text-xs">· {tr.mood} · {tr.bpm} BPM</span>
                </button>
              ))}
              <p className="text-[11px] opacity-40 mt-2">
                Backed by the licensed music partner API — real catalog search replaces this mock list once MUSIC_PROVIDER_API_KEY is set.
              </p>
            </div>
          ) : (
            <p className="text-sm opacity-60">Upgrade to Pro for the full licensed catalog. Free plan uses a small CC0 track set.</p>
          )}
        </div>

        <button onClick={handleExport} disabled={exporting} className="btn-gold w-full py-2.5 rounded-full disabled:opacity-50">
          {exporting ? "Rendering…" : "Export"}
        </button>
        {exported && (
          <div className="text-sm card p-3 border-kraft-gold">
            ✅ Ready: <span className="text-kraft-gold">{exported}</span>
            {!isPro && <p className="text-xs opacity-60 mt-1">Free exports are watermarked at 720p. Upgrade for clean 1080p+.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
