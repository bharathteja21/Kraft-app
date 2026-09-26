import "./globals.css";
import { SessionProvider } from "@/lib/session-store";
import SiteChrome from "@/components/SiteChrome";

export const metadata = {
  title: "Kraft — Craft your content",
  description: "Templates, editing, and licensed music for creators.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-kraft-bg text-kraft-cream font-sans">
        <SessionProvider>
          <SiteChrome>{children}</SiteChrome>
        </SessionProvider>
      </body>
    </html>
  );
}
