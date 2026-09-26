import { NextRequest, NextResponse } from "next/server";
import { adminStore } from "@/lib/adminStore";

export async function GET() {
  return NextResponse.json({ users: adminStore.users });
}

export async function PATCH(req: NextRequest) {
  const { id, plan } = await req.json();
  const user = adminStore.users.find((u) => u.id === id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  user.plan = plan;
  return NextResponse.json({ user });
}
