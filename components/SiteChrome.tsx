"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";
import ChatWidget from "@/components/ChatWidget";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Admin area has its own layout/styling — skip the public nav and chat widget.
    return <>{children}</>;
  }

  return (
    <>
      <NavBar />
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
      <ChatWidget />
    </>
  );
}
