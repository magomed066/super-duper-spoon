import { unlink } from 'node:fs/promises'

import { toStoredMenuUploadPath } from '../../../common/uploads/file-storage.js'

export function assertUploadedMenuItemFileSize(
  file: Express.Multer.File | undefined,
  maxSizeMb: number,
  label: string
): void {
  if (!file) {
    return
  }

  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`${label} должен быть не больше ${maxSizeMb} МБ`)
  }
}

export async function cleanupUploadedMenuItemFile(
  file: Express.Multer.File | undefined
): Promise<void> {
  if (!file) {
    return
  }

  try {
    await unlink(file.path)
  } catch {
    // Best-effort cleanup for failed requests.
  }
}

export async function cleanupReplacedMenuItemFile(
  previousImage: string | null,
  nextImage: string | null,
  imageUpdated: boolean
): Promise<void> {
  if (!imageUpdated || !previousImage || previousImage === nextImage) {
    return
  }

  const storedPath = toStoredMenuUploadPath(previousImage)

  if (!storedPath) {
    return
  }

  try {
    await unlink(storedPath)
  } catch {
    // Best-effort cleanup for replaced media.
  }
}
