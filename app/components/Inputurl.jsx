"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fadeScale, floatHover } from "@/lib/animations";
import { toast } from "sonner";

export default function Inputurl({ onSuccess }) {
  const [longUrl, setLongUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const cardRef = useRef(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    fadeScale(cardRef.current, 0.06);
    floatHover(cardRef.current);
  }, []);

  // for email validation
  const urlRegex =
    /^(https?:\/\/)([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

    // submit fn 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!urlRegex.test(longUrl.trim())) {
      setError("Please enter a valid URL that starts with http:// or https://");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl: longUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create short url");
        setLoading(false);
        return;
      }

      const finalShortURL = `${baseUrl}/${data.code}`;
      setShortUrl(finalShortURL);
      toast.success("Short URL created");
      setLongUrl("");
      onSuccess?.();
    } catch (err) {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center mb-6">
      <Card className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl">
        <CardHeader className="text-center pt-6">
          <CardTitle className="text-3xl font-bold text-slate-900">
            MiniURL
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="text-sm font-medium block">Enter long URL</label>
            <Input
              placeholder="https://example.com/path"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}

            {shortUrl && (
              <div className="bg-white/60 border border-white/40 p-3 rounded-md text-sm">
                <p className="text-slate-800 font-medium">Short URL</p>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {shortUrl}
                </a>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold p-3 rounded-xl shadow hover:opacity-90"
            >
              {loading ? "Creating..." : "Shorten URL"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
