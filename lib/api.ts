import type { ObjectItem } from "@/types/object";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204 || !text.trim()) return undefined as T;
  return JSON.parse(text) as T;
}

export async function getObjects(): Promise<ObjectItem[]> {
  const res = await fetch(`${API_URL}/objects`);
  return handleResponse<ObjectItem[]>(res);
}

export async function getObject(id: string): Promise<ObjectItem> {
  const res = await fetch(`${API_URL}/objects/${id}`);
  return handleResponse<ObjectItem>(res);
}

export async function createObject(
  title: string,
  description: string,
  image: File
): Promise<ObjectItem> {
  const form = new FormData();
  form.append("title", title);
  form.append("description", description);
  form.append("image", image);
  const res = await fetch(`${API_URL}/objects`, {
    method: "POST",
    body: form,
  });
  return handleResponse<ObjectItem>(res);
}

export async function deleteObject(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/objects/${id}`, { method: "DELETE" });
  await handleResponse<void>(res);
}
