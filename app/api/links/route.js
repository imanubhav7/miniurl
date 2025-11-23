import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { longUrl, code } = body;

  if (!longUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const customCode = code || Math.random().toString(36).substring(2, 8);

  const existing = await db.link.findUnique({
    where: { code: customCode }
  });

  if (existing) {
    return NextResponse.json({ error: "Code already exists" }, { status: 409 });
  }

  const link = await db.link.create({
    data: {
      code: customCode,
      longUrl
    },
  });

  return NextResponse.json(link, { status: 201 });
}

// getting all links
export async function GET() {
  const links = await db.link.findMany({
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(links);
}
