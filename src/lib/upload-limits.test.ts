import { describe, it, expect } from 'vitest'
import { validateImageUpload, MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from './upload-limits'

const MB = 1024 * 1024

describe('validateImageUpload', () => {
  it('accepts a supported image under the limit (<3 MB)', () => {
    expect(validateImageUpload({ type: 'image/png', size: 2 * MB })).toBeNull()
    expect(validateImageUpload({ type: 'image/jpeg', size: MAX_UPLOAD_BYTES })).toBeNull() // exactly 3 MB is allowed
  })

  it('rejects a file over the limit (>3 MB) with a clear message', () => {
    const msg = validateImageUpload({ type: 'image/png', size: MAX_UPLOAD_BYTES + 1 })
    expect(msg).toBe(`Image is too large (max ${MAX_UPLOAD_MB} MB).`)
    expect(validateImageUpload({ type: 'image/jpeg', size: 5 * MB })).toMatch(/too large/)
  })

  it('rejects an unsupported type before checking size', () => {
    expect(validateImageUpload({ type: 'application/pdf', size: 1 * MB })).toMatch(/Unsupported image type/)
    expect(validateImageUpload({ type: 'image/gif', size: 10 * MB })).toMatch(/Unsupported image type/)
  })

  it('caps at 3 MB', () => {
    expect(MAX_UPLOAD_MB).toBe(3)
    expect(MAX_UPLOAD_BYTES).toBe(3 * MB)
  })
})
