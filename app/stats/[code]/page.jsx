import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import db from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import React from "react";

const StatsPage = async ({ params }) => {
  const { code } = params;

  const link = await db.link.findUnique({
    where: { code },
  });

  if (!link) {
    return (
      <div className="p-10 text-center text-red-500 text-xl">
        Short URL not found.
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const shortUrl = `${baseUrl}/${link.code}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6 mt-10 p-4">
      <Card className="shadow-xl border bg-white/10 backdrop-blur-lg rounded-2xl p-2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Short URL Analytics
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-400">Short URL</p>
            <p className="text-blue-500 underline break-all">{shortUrl}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-400">Original URL</p>
            <p className="break-all">{link.longUrl}</p>
          </div>

          <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
            <span className="font-semibold">Total Clicks</span>
            <span className="text-2xl font-bold">{link.clickCount}</span>
          </div>

          <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
            <span className="font-semibold">Created At</span>
            <span>{new Date(link.createdAt).toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
            <span className="font-semibold">Last Clicked</span>
            <span>
              {link.lastClicked
                ? new Date(link.lastClicked).toLocaleString()
                : "-"}
            </span>
          </div>

          <Button
            asChild
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <a href={`/${link.code}`} target="_blank">
              Open Short URL
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPage;
