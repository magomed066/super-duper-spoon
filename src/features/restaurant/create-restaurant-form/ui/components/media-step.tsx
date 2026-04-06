import { Box, Divider, Stack, Text } from '@mantine/core'
import { UploadLogoPreviewFeature } from '../upload-logo/upload-logo-preview'

type MediaStepProps = {
  defaultLogo: string
  defaultPreview: string
  isPending: boolean
  onUpload: (file: File, uploadType?: 'logo' | 'preview') => void
}

export function MediaStep({
  defaultLogo,
  defaultPreview,
  isPending,
  onUpload
}: MediaStepProps) {
  return (
    <Stack gap="lg">
      <Box>
        <UploadLogoPreviewFeature
          required
          isLoading={isPending}
          onUpload={onUpload}
          defaultLogo={defaultLogo}
          defaultPreview={defaultPreview}
        />
        <Divider className="border-black/8" mt="0" />
      </Box>

      <Text size="sm" className="leading-6 text-moss-700">
        После создания ресторан появится в общем списке и будет привязан к
        вашей учетной записи как к владельцу.
      </Text>
    </Stack>
  )
}
