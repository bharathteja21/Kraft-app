import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// This route updates a `profiles.plan` column in Supabase whenever Stripe
// tells us a subscription was created, updated, or canceled. It requires:
//   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
//   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Register this endpoint's URL (https://yourdomain.com/api/stripe/webhook)
// in the Stripe dashboard once you go live.

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 200 });
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAdmin = supabaseUrl && serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null;

  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.updated": {
      const session = event.data.object as Stripe.Checkout.Session;
      const plan = (session.metadata?.plan as string) || "pro";
      const customerEmail = session.customer_details?.email;
      if (supabaseAdmin && customerEmail) {
        await supabaseAdmin.from("profiles").update({ plan }).eq("email", customerEmail);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      if (supabaseAdmin) {
        await supabaseAdmin.from("profiles").update({ plan: "free" }).eq("stripe_customer_id", sub.customer as string);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
