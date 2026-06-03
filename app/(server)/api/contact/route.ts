import { submitContactAction } from "@/app/(server)/actions/contact";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 },
      );
    }

    const result = await submitContactAction(name, email, subject, message);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { messageId: result.messageId, message: "Message envoyé avec succès" },
      { status: 201 },
    );
  } catch (error) {
    console.error("[v0] Contact API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
