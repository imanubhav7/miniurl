import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { code } = await params;  

  const link = await db.link.findUnique({
    where: { code },
  });

  if (!link) {
    return new NextResponse("Short URL not found", { status: 404 });
  }

  await db.link.update({
    where: { code },
    data: {
      clickCount: { increment: 1 },
      lastClicked: new Date(),
    },
  });

  return NextResponse.redirect(link.longUrl);
}
