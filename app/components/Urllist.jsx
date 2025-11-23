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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fadeSlideUp, floatHover } from "@/lib/animations";
import { toast } from "sonner";

export default function Urllist({ links = [], refresh, setLinks }) {
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteCode, setDeleteCode] = useState(null);
  const tableRef = useRef(null);
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // gsap animation
  useEffect(() => {
    if (links.length > 0 && tableRef.current)
      fadeSlideUp(tableRef.current, 0.06);
  }, [links.length]);

  useEffect(() => {
    if (tableRef.current) floatHover(tableRef.current);
  }, []);

  // click fn 
  const increaseClickCount = (code) => {
    setLinks((prev) =>
      prev.map((item) =>
        item.code === code ? { ...item, clickCount: item.clickCount + 1 } : item
      )
    );
  };

  // shortURL fn
  const copyShort = (code) => {
    const url = `${baseUrl}/${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Copied short URL");
  };

  // Delete Fn 
  const handleDelete = async () => {
    if (!deleteCode) return toast.error("No code selected");

    const res = await fetch(`/api/links/${deleteCode}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) return toast.error(data.error || "Delete failed");

    toast.success("Deleted");

    setLinks((prev) => prev.filter((l) => l.code !== deleteCode));

    setOpenDelete(false);
    setDeleteCode(null);
    refresh();
  };

  return (
    <>
      <div
        className="backdrop-blur-xl bg-white border
                rounded-2xl p-6 w-full max-w-5xl mx-auto shadow-lg"
      >
        <h2 className="text-lg sm:text-2xl font-semibold mb-3">
          Your Shortened Links
        </h2>

        <div
          ref={tableRef}
          className="max-h-[440px] overflow-auto border rounded-md"
        >
          <Table className="min-w-[680px]">
            <TableHeader className="sticky top-0 bg-white/10 backdrop-blur-md text-white">
              <TableRow className="hover:bg-white/10 transition">
                <TableHead>Short URL</TableHead>
                <TableHead>Original URL</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!links.length && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-black text-center font-semibold text-md"
                  >
                    No links yet.
                  </TableCell>
                </TableRow>
              )}

              {links.map((l) => (
                <TableRow
                  key={l.code}
                  className="transition-colors hover:bg-slate-50/70"
                >
                  <TableCell className="break-all">
                    <Link
                      href={`/${l.code}`}
                      target="_blank"
                      className="text-sky-600 underline"
                      onClick={() => increaseClickCount(l.code)}
                    >
                      {`${baseUrl}/${l.code}`}
                    </Link>
                  </TableCell>

                  <TableCell className="truncate max-w-[380px]">
                    {l.longUrl}
                  </TableCell>

                  <TableCell>{l.clickCount}</TableCell>

                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyShort(l.code)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>

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

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Link</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            Are you sure? you want to delete this link.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
