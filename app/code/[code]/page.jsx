"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function StatsPage() {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchData = async () => {
    const res = await fetch(`/api/links/${code}`);
    const json = await res.json();

    if (res.ok) setData(json);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return <p className="text-center text-white mt-10">Loading stats...</p>;

  if (!data)
    return (
      <p className="text-center text-red-400 mt-10">
        No stats found for this code.
      </p>
    );

  const fullShortUrl = `${baseUrl}/${data.code}`;

  return (
    <div className="max-w-2xl mx-auto mt-16 text-white px-4">
      <Link href="/">
        <Button variant="outline" className="mb-6 bg-white text-black">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
        <h1 className="text-3xl font-bold mb-4">Link Stats</h1>

        <div className="space-y-4 text-white/90">
          <div>
            <p className="text-sm text-white/60">Short Link</p>
            <p className="font-semibold break-all text-blue-300">
              {fullShortUrl}
            </p>
          </div>

          <div>
            <p className="text-sm text-white/60">Original URL</p>
            <p className="font-semibold break-all">{data.longUrl}</p>
          </div>

          <div>
            <p className="text-sm text-white/60">Total Clicks</p>
            <p className="font-semibold">{data.clickCount}</p>
          </div>

          <div>
            <p className="text-sm text-white/60">Last Clicked</p>
            <p className="font-semibold">
              {data.lastClicked
                ? new Date(data.lastClicked).toLocaleString()
                : "Never"}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(fullShortUrl);
              toast.success("Copied short link!");
            }}
            className="bg-white text-black"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>

          <Button
            variant="destructive"
            onClick={async () => {
              await fetch(`/api/links/${code}`, { method: "DELETE" });
              toast.success("Deleted link");
              window.location.href = "/";
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
