import { validateImageUpload } from './upload-limits'

/**
 * Upload an image to /api/admin/upload.
 *
 * Validates client-side first (size + type) so an oversized/invalid file never
 * hits the network, then surfaces the server's specific error message on
 * failure instead of a generic string. Returns the stored path
 * (e.g. `/uploads/uuid.png`). Throws Error(message) on any validation, network,
 * or server error — callers should catch and display `e.message`.
 */
export async function uploadImage(file: File): Promise<string> {
  const invalid = validateImageUpload(file)
  if (invalid) throw new Error(invalid)

  const fd = new FormData()
  fd.append('file', file)

  let res: Response
  try {
    res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
  } catch {
    throw new Error('Image upload failed (network error).')
  }

  if (!res.ok) {
    const j = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(j.error || `Image upload failed (${res.status}).`)
  }

  const { path } = (await res.json()) as { path: string }
  return path
}
