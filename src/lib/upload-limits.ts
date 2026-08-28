// Shared image-upload limits. Imported by BOTH the server route
// (src/app/api/admin/upload/route.ts) and the client helper
// (src/lib/upload-client.ts) so the cap and allowed types are defined once and
// validated on both sides. Pure module — no browser or Node-only APIs.
export const MAX_UPLOAD_MB = 3
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024

// Accepted MIME type -> stored file extension.
export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

export const ALLOWED_IMAGE_LABEL = 'JPG, PNG, WebP or AVIF'

/**
 * Validate an image upload. Returns a human-readable error message, or null when
 * the file is acceptable. Pure and side-effect free so it can run client-side
 * (before the network request) and server-side (never trust the client).
 */
export function validateImageUpload(file: { type: string; size: number }): string | null {
  if (!ALLOWED_IMAGE_TYPES[file.type]) {
    return `Unsupported image type. Use ${ALLOWED_IMAGE_LABEL}.`
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `Image is too large (max ${MAX_UPLOAD_MB} MB).`
  }
  return null
}
