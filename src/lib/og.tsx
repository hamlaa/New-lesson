import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

/** Reads a file from /public and returns a data: URI for <img> inside ImageResponse. */
export async function publicDataUri(path?: string) {
  if (!path) return null;
  try {
    const buf = await readFile(join(process.cwd(), "public", path.replace(/^\/+/, "")));
    const ext = path.split(".").pop()?.toLowerCase();
    const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}
