"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { fadeSlideUp, floatHover } from "@/lib/animations";
import { toast } from "sonner";

export default function Urllist({ links = [], refresh, setLinks }) {
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteCode, setDeleteCode] = useState(null);
  const tableRef = useRef(null);
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // GSAP Animations
  useEffect(() => {
    if (links.length > 0 && tableRef.current) {
      fadeSlideUp(tableRef.current, 0.06);
    }
  }, [links.length]);

  useEffect(() => {
    if (tableRef.current) floatHover(tableRef.current);
  }, []);

  // Copy short link
  const copyShort = (code) => {
    const url = `${baseUrl}/${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Copied short URL!");
  };

  // Delete link
  const handleDelete = async () => {
    if (!deleteCode) return toast.error("No code selected");

    const res = await fetch(`/api/links/${deleteCode}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Delete failed");
      return;
    }

    toast.success("Link deleted");

    // Remove from UI instantly
    setLinks((prev) => prev.filter((l) => l.code !== deleteCode));

    setOpenDelete(false);
    setDeleteCode(null);
    refresh();
  };

  return (
    <>
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 
                rounded-2xl p-6 w-full max-w-5xl mx-auto shadow-lg">
        <h2 className="text-lg sm:text-2xl font-semibold mb-3">Your Shortened Links</h2>

        <div ref={tableRef} className="max-h-[440px] overflow-auto border rounded-md">
          <Table className="min-w-[680px]">
            <TableHeader className="sticky top-0 bg-white/10 backdrop-blur-md text-white">
              <TableRow>
                <TableHead>Short URL</TableHead>
                <TableHead>Original URL</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {links.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-6 text-center text-white/80">
                    No links yet.
                  </TableCell>
                </TableRow>
              )}

              {links.map((l) => (
                <TableRow key={l.code} className="transition-colors hover:bg-white/10">
                  {/* FIXED: Use <a> tag instead of Next.js <Link> — NO PREFETCH */}
                  <TableCell className="break-all">
                    <a
                      href={`/${l.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 underline"
                    >
                      {`${baseUrl}/${l.code}`}
                    </a>
                  </TableCell>

                  <TableCell className="truncate max-w-[380px]">
                    {l.longUrl}
                  </TableCell>

                  <TableCell className="text-center">{l.clickCount}</TableCell>

                  <TableCell className="text-right space-x-2">
                    {/* Copy Button */}
                    <Button variant="outline" size="sm" onClick={() => copyShort(l.code)}>
                      <Copy className="w-4 h-4" />
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeleteCode(l.code);
                        setOpenDelete(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Link</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-slate-600">
            Are you sure? This action cannot be undone.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
