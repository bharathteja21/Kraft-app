export type PlanId = "free" | "pro" | "studio";

export const PLANS: Record<PlanId, { name: string; price: string; features: string[] }> = {
  free: {
    name: "Free",
    price: "$0",
    features: [
      "Core templates (motion intro, video reel, carousel)",
      "Watermarked exports",
      "Standard render resolution",
      "CC0 background music",
    ],
  },
  pro: {
    name: "Pro",
    price: "$19/mo",
    features: [
      "Everything in Free",
      "Full Pro template library",
      "Watermark-free exports",
      "High-resolution render (Remotion Lambda)",
      "Licensed music catalog (mood/genre/BPM search)",
      "AI chat assistant",
    ],
  },
  studio: {
    name: "Studio",
    price: "$49/mo",
    features: [
      "Everything in Pro",
      "Team seats",
      "Priority render queue",
      "Exclusive designer template drops",
    ],
  },
};
