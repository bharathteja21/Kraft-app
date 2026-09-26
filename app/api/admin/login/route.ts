import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, createSessionToken, verifyAdminCredentials } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Admin credentials are not configured on the server (set ADMIN_EMAIL / ADMIN_PASSWORD)." },
      { status: 500 }
    );
  }

  if (!verifyAdminCredentials(email, password)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = await createSessionToken(email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
