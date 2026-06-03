import { subscribeNewsletterAction } from "@/app/(server)/actions/contact";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    const result = await subscribeNewsletterAction(email);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Abonnement réussi à la newsletter" },
      { status: 201 },
    );
  } catch (error) {
    console.error("[v0] Newsletter API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
