import { Box, Divider, Stack, Text } from '@mantine/core'
import { UploadLogoPreviewFeature } from '../upload-logo/upload-logo-preview'

type MediaStepProps = {
  defaultLogo: string
  defaultPreview: string
  isPending: boolean
  required?: boolean
  allowUpload?: boolean
  onUpload: (file: File, uploadType?: 'logo' | 'preview') => void
}

export function MediaStep({
  defaultLogo,
  defaultPreview,
  isPending,
  required,
  allowUpload = true,
  onUpload
}: MediaStepProps) {
  return (
    <Stack gap="lg">
      <Box>
        <UploadLogoPreviewFeature
          required={required}
          isLoading={isPending}
          onUpload={onUpload}
          defaultLogo={defaultLogo}
          defaultPreview={defaultPreview}
          disabled={!allowUpload}
        />
        <Divider className="border-black/8" mt="0" />
      </Box>

      <Text size="sm" className="leading-6 text-moss-700">
        {allowUpload
          ? 'После создания ресторан появится в общем списке и будет привязан к вашей учетной записи как к владельцу.'
          : 'В режиме редактирования можно просмотреть текущие изображения. Замена файлов потребует отдельной поддержки обновления медиа на сервере.'}
      </Text>
    </Stack>
  )
}
