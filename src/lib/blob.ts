import { del } from "@vercel/blob";

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isBlobUrl(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

/**
 * Best-effort removal of uploaded files. Only touches files hosted in our
 * Blob store (external URLs like Unsplash are skipped), and never throws —
 * a failed cleanup must not fail the product save/delete that triggered it.
 */
export async function deleteBlobUrls(urls: string[]): Promise<void> {
  const blobUrls = urls.filter(isBlobUrl);
  if (blobUrls.length === 0 || !isBlobConfigured()) return;

  try {
    await del(blobUrls);
  } catch (error) {
    console.error("Failed to delete blob files", error);
  }
}
