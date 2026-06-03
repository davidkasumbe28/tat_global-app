import logs from "@/lib/utils/logs";
import { NextResponse } from "next/server";

export default async function GET() {
  try {
    NextResponse.json({ data: "API" }, { status: 200 });
  } catch (error) {
    console.log(error);
    NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
