export type Props = {
  onUpload?: (file: File, uploadType?: 'logo' | 'preview') => void
  required?: boolean
  isLoading?: boolean
  defaultLogo?: string
  defaultPreview?: string
  disabled?: boolean
}
