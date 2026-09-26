"use client";

import Link from "next/link";
import { useSession } from "@/lib/session-store";
import { PLANS } from "@/lib/plans";

export default function NavBar() {
  const { plan, email } = useSession();

  return (
    <header className="border-b border-kraft-line">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-2xl tracking-wide text-kraft-gold">
          KRAFT
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/templates" className="hover:text-kraft-gold">Templates</Link>
          <Link href="/brand-kit" className="hover:text-kraft-gold">Brand Kit</Link>
          <Link href="/billing" className="hover:text-kraft-gold">Billing</Link>
          <span className="pill border border-kraft-gold text-kraft-gold">
            {PLANS[plan].name} plan
          </span>
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-full btn-gold text-sm"
          >
            {email ? email.split("@")[0] : "Sign in"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
