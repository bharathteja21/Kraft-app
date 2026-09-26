import Link from "next/link";

export default function Dashboard() {
  return (
    <div>
      <section className="mb-12">
        <h1 className="font-serif text-4xl text-kraft-gold mb-3">Craft content worthy of the feed you want.</h1>
        <p className="opacity-80 max-w-xl mb-6">
          Motion intros, video reels, and graphic carousels — no After Effects, Premiere, or Illustrator required. Licensed music included on Pro.
        </p>
        <div className="flex gap-3">
          <Link href="/templates" className="btn-gold px-5 py-2.5 rounded-full">Browse templates</Link>
          <Link href="/billing" className="px-5 py-2.5 rounded-full border border-kraft-gold text-kraft-gold">See plans</Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Your Projects", desc: "Continue an in-progress edit.", href: "/templates", cta: "Open templates" },
          { title: "Brand Kit", desc: "Logo, colors and font applied across every template.", href: "/brand-kit", cta: "Edit brand kit" },
          { title: "Billing", desc: "Manage your plan and see what Pro unlocks.", href: "/billing", cta: "View plans" },
        ].map((c) => (
          <Link key={c.title} href={c.href} className="card p-5 hover:border-kraft-gold transition">
            <h3 className="font-serif text-lg text-kraft-gold mb-2">{c.title}</h3>
            <p className="text-sm opacity-70 mb-4">{c.desc}</p>
            <span className="text-sm text-kraft-gold">{c.cta} →</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
