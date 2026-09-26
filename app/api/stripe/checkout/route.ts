import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO;

  if (!secretKey || !priceId) {
    // No Stripe keys yet — let the client fall back to flipping the demo plan.
    return NextResponse.json({ url: null });
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
  const { plan } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${req.nextUrl.origin}/billing?success=true`,
    cancel_url: `${req.nextUrl.origin}/billing?canceled=true`,
    metadata: { plan },
  });

  return NextResponse.json({ url: session.url });
}
