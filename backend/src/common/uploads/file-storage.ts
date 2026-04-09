import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import multer from 'multer'

import { RestaurantsHttpError } from '../../modules/restaurants/restaurants.errors.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const uploadsRootDir = path.resolve(__dirname, '../../../uploads')
const restaurantUploadsDir = path.join(uploadsRootDir, 'restaurants')

fs.mkdirSync(restaurantUploadsDir, { recursive: true })

const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml'
])

const getFileExtension = (file: Express.Multer.File): string => {
  const originalExtension = path.extname(file.originalname).toLowerCase()

  if (originalExtension) {
    return originalExtension
  }

  switch (file.mimetype) {
    case 'image/jpeg':
      return '.jpg'
    case 'image/png':
      return '.png'
    case 'image/webp':
      return '.webp'
    case 'image/svg+xml':
      return '.svg'
    default:
      return ''
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, restaurantUploadsDir)
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${file.fieldname}-${uniqueSuffix}${getFileExtension(file)}`)
  }
})

export const restaurantMediaUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 2
  },
  fileFilter: (_req, file, cb) => {
    if (!IMAGE_MIME_TYPES.has(file.mimetype)) {
      cb(
        new RestaurantsHttpError(
          400,
          'Only JPG, PNG, WEBP and SVG image files are supported'
        )
      )
      return
    }

    cb(null, true)
  }
})

export const toPublicUploadPath = (filename: string): string =>
  `/uploads/restaurants/${filename}`

export const toStoredUploadPath = (publicPath?: string | null): string | null => {
  if (!publicPath?.startsWith('/uploads/restaurants/')) {
    return null
  }

  return path.join(uploadsRootDir, publicPath.replace('/uploads/', ''))
}
