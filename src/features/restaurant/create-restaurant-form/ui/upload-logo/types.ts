export type Props = {
  onUpload?: (imageValue: string, uploadType?: 'logo' | 'preview') => void
  required?: boolean
  isLoading?: boolean
  defaultLogo?: string
  defaultPreview?: string
  disabled?: boolean
}
