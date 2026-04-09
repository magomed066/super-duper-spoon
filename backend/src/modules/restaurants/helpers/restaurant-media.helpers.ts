import { unlink } from 'node:fs/promises'
import type { Request } from 'express'
import type { MulterError } from 'multer'

import { toStoredUploadPath } from '../../../common/uploads/file-storage.js'
import { RestaurantsHttpError } from '../restaurants.errors.js'
import type { UploadedRestaurantFiles } from '../types/restaurant.controller.types.js'

export function getUploadedFiles(
  files: Request['files']
): UploadedRestaurantFiles {
  if (!files || Array.isArray(files)) {
    return {}
  }

  return files as UploadedRestaurantFiles
}

export function assertUploadedFileSize(
  file: Express.Multer.File | undefined,
  maxSizeMb: number,
  label: string
): void {
  if (!file) {
    return
  }

  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new RestaurantsHttpError(
      400,
      `${label} должен быть не больше ${maxSizeMb} МБ`
    )
  }
}

export async function cleanupUploadedFiles(
  files: UploadedRestaurantFiles
): Promise<void> {
  const uploadedFiles = [...(files.logoFile ?? []), ...(files.previewFile ?? [])]

  await Promise.all(
    uploadedFiles.map(async (file) => {
      try {
        await unlink(file.path)
      } catch {
        // Best-effort cleanup for failed requests.
      }
    })
  )
}

export async function cleanupReplacedFiles(
  previousRestaurant: { logo: string | null; preview: string | null },
  updatedRestaurant: { logo: string | null; preview: string | null },
  logoUpdated: boolean,
  previewUpdated: boolean
): Promise<void> {
  const filesToDelete = [
    logoUpdated &&
    previousRestaurant.logo &&
    previousRestaurant.logo !== updatedRestaurant.logo
      ? toStoredUploadPath(previousRestaurant.logo)
      : null,
    previewUpdated &&
    previousRestaurant.preview &&
    previousRestaurant.preview !== updatedRestaurant.preview
      ? toStoredUploadPath(previousRestaurant.preview)
      : null
  ].filter((value): value is string => Boolean(value))

  await Promise.all(
    filesToDelete.map(async (filePath) => {
      try {
        await unlink(filePath)
      } catch {
        // Best-effort cleanup for replaced media.
      }
    })
  )
}

export function getMulterErrorMessage(error: MulterError): string {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return 'Файл должен быть не больше 10 МБ'
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return 'Можно загрузить не более двух файлов'
  }

  return error.message
}
