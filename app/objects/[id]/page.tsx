"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getObject, deleteObject } from "@/lib/api";
import type { ObjectItem } from "@/types/object";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ObjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [object, setObject] = useState<ObjectItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getObject(id)
      .then((data) => {
        if (!cancelled) setObject(data);
      })
      .catch((e) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load object");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this object? This cannot be undone.")) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteObject(id);
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8">
        <p className="text-zinc-500">Loading…</p>
      </div>
    );
  }

  if (error || !object) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8">
        <p className="text-red-600 dark:text-red-400">
          {error ?? "Object not found"}
        </p>
        <Link href="/" className="mt-4 inline-block">
          <Button variant="outline">Back to list</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-semibold">Object details</h1>
          <Link href="/">
            <Button variant="outline">Back to list</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <Card className="overflow-hidden">
          <div className="aspect-video w-full bg-zinc-200 dark:bg-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={object.imageUrl}
              alt={object.title}
              className="h-full w-full object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">{object.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-600 dark:text-zinc-400">
              {object.description}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              Created:{" "}
              {new Date(object.createdAt).toLocaleString()}
            </p>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete object"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
