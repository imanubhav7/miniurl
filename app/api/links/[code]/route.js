import db from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET Fn 
export async function GET(req, context) {
  const { code } = await context.params;   

  const link = await db.link.findUnique({
    where: { code },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  return NextResponse.json(link);
}

// DELETE Fn
export async function DELETE(req, context) {
  const { code } = await context.params;   

  const link = await db.link.findUnique({
    where: { code },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  await db.link.delete({
    where: { code },
  });

  return NextResponse.json({ success: true });
}
