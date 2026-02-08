"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getObjects } from "@/lib/api";
import type { ObjectItem } from "@/types/object";
import { useObjectsSocket } from "@/hooks/use-objects-socket";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchObjects = async () => {
    try {
      setError(null);
      const list = await getObjects();
      setObjects(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load objects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, []);

  useObjectsSocket(
    (newObj) => {
      setObjects((prev) => [newObj, ...prev]);
    },
    (id) => {
      setObjects((prev) => prev.filter((o) => o._id !== id));
    }
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-semibold">Heyana Objects</h1>
          <Link href="/create">
            <Button>Create Object</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {loading && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Loading…
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {!loading && !error && objects.length === 0 && (
          <p className="text-zinc-500 dark:text-zinc-400">
            No objects yet. Create one to get started.
          </p>
        )}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {objects.map((obj) => (
            <li key={obj._id}>
              <Link href={`/objects/${obj._id}`}>
                <Card className="overflow-hidden transition-shadow hover:shadow-md">
                  <div className="aspect-video w-full bg-zinc-200 dark:bg-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={obj.imageUrl}
                      alt={obj.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1 text-base">
                      {obj.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {obj.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
