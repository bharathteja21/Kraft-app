import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are the Kraft in-app assistant. Kraft is a content
editing tool for influencers with motion/video/graphic templates and a
licensed music library. Help users pick the right template for their content,
explain how exports and the Pro plan work, and keep answers short (2-4
sentences) since this is a small chat widget.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { reply: "Chat isn't configured yet — set ANTHROPIC_API_KEY in your environment to enable it." },
      { status: 200 }
    );
  }

  const { messages } = await req.json();
  const anthropic = new Anthropic({ apiKey });

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; text: string }) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      })),
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const reply = textBlock && "text" in textBlock ? textBlock.text : "Sorry, I couldn't generate a reply.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Anthropic API error", err);
    return NextResponse.json({ reply: "The assistant is temporarily unavailable." }, { status: 200 });
  }
}
