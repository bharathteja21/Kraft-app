import { NextRequest, NextResponse } from "next/server";
import { adminStore, AdminTemplate } from "@/lib/adminStore";

export async function GET() {
  return NextResponse.json({ templates: adminStore.templates });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newTemplate: AdminTemplate = {
    id: body.id || `tpl-${Date.now()}`,
    name: body.name,
    category: body.category,
    tier: body.tier === "pro" ? "pro" : "free",
    durationSec: Number(body.durationSec) || 0,
    aspect: body.aspect || "1:1",
  };
  adminStore.templates.push(newTemplate);
  return NextResponse.json({ template: newTemplate }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json();
  const template = adminStore.templates.find((t) => t.id === id);
  if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });
  Object.assign(template, updates);
  return NextResponse.json({ template });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const idx = adminStore.templates.findIndex((t) => t.id === id);
  if (idx === -1) return NextResponse.json({ error: "Template not found" }, { status: 404 });
  const [removed] = adminStore.templates.splice(idx, 1);
  return NextResponse.json({ removed });
}
