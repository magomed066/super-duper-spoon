import { useEffect, useState } from 'react'
import cn from 'classnames'
import {
  BackgroundImage,
  Box,
  Button,
  Center,
  FileButton,
  Flex,
  InputLabel,
  LoadingOverlay,
  Text
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import Frame from './img/frame.png'
import { type Props } from './types'
import { BiImageAdd } from 'react-icons/bi'
import { resolveMediaUrl } from '@/shared/lib/helpers/media'

export function UploadLogoPreviewFeature(props: Props) {
  const {
    onUpload,
    required,
    isLoading,
    defaultLogo = '',
    defaultPreview = '',
    disabled = false
  } = props
  const resolvedDefaultPreview = resolveMediaUrl(defaultPreview)
  const resolvedDefaultLogo = resolveMediaUrl(defaultLogo)

  const [preview, setPreview] = useState(resolvedDefaultPreview)
  const [logo, setLogo] = useState(resolvedDefaultLogo)

  useEffect(() => {
    setPreview(resolvedDefaultPreview)
  }, [resolvedDefaultPreview])

  useEffect(() => {
    setLogo(resolvedDefaultLogo)
  }, [resolvedDefaultLogo])

  const handleFile = async (file: File | null, type: 'logo' | 'preview') => {
    if (!file) {
      return
    }

    try {
      const dataUrl = await readFileAsDataUrl(file)

      if (type === 'logo') {
        setLogo(dataUrl)
        onUpload?.(dataUrl, type)
      }

      if (type === 'preview') {
        setPreview(dataUrl)
        onUpload?.(dataUrl, type)
      }
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Ошибка загрузки изображения',
        message:
          error instanceof Error ? error.message : 'Не удалось обработать файл'
      })
    }
  }

  return (
    <Flex justify="space-between" h={368} pr={12}>
      <Box>
        <InputLabel
          mb={24}
          required={required}
          fz={24}
          className="leading-7 text-moss-900"
          fw={600}
        >
          Оформление ресторана
        </InputLabel>

        <Flex maw={316} w="100%" direction="column" gap={4}>
          <Text size="md" className="leading-5 text-moss-900">
            Логотип
          </Text>
          <Text size="sm" className="leading-5 text-moss-700">
            Формат — JPG, PNG, SVG не более 5 Мб Рекомендуемое разрешение 1080 х
            1080 (1:1)
          </Text>

          <FileButton
            onChange={(file) => handleFile(file, 'logo')}
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            disabled={disabled}
          >
            {({ onClick }) => (
              <Button
                onClick={onClick}
                maw={197}
                fullWidth
                h={40}
                mt={8}
                radius={8}
                color="aurora"
                disabled={disabled}
              >
                <BiImageAdd size={18} className="mr-2" />
                {disabled ? 'Редактирование недоступно' : 'Загрузить логотип'}
              </Button>
            )}
          </FileButton>
        </Flex>

        <Flex maw={330} w="100%" direction="column" gap={4} mt={32}>
          <Text size="md" className="leading-5 text-moss-900">
            Обложка
          </Text>
          <Text size="sm" className="leading-5 text-moss-700">
            Формат — JPG, PNG, не более 10 Мб Рекомендуемое разрешение 1920 х
            1080 (16:9)
          </Text>

          <FileButton
            onChange={(file) => handleFile(file, 'preview')}
            accept="image/png,image/jpeg,image/webp"
            disabled={disabled}
          >
            {({ onClick }) => (
              <Button
                onClick={onClick}
                maw={203}
                fullWidth
                h={40}
                mt={8}
                radius={8}
                color="aurora"
                disabled={disabled}
              >
                <BiImageAdd size={18} className="mr-2" />
                {disabled ? 'Редактирование недоступно' : 'Загрузить обложку'}
              </Button>
            )}
          </FileButton>
        </Flex>
      </Box>
      <Box maw={400} w="100%" pt={12}>
        <BackgroundImage src={Frame} w="100%" h="100%">
          <Center pt={80}>
            <Flex direction="column">
              <Box
                w={336}
                h={189}
                className={cn(
                  'relative rounded-xl z-10 bg-white flex items-center justify-center overflow-hidden',
                  preview ? '' : 'border border-dashed border-moss-400',
                  isLoading && 'border-none'
                )}
                id="preview"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Text size="xs" className="text-moss-700">
                    Обложка
                  </Text>
                )}

                {isLoading ? (
                  <LoadingOverlay
                    visible
                    zIndex={1000}
                    overlayProps={{
                      radius: 'sm',
                      blur: 1,
                      opacity: 1
                    }}
                    loaderProps={{
                      color: 'aurora'
                    }}
                  />
                ) : null}

                <Flex
                  justify="center"
                  align="center"
                  className={cn(
                    'absolute bg-moss-50 bottom-2 z-99 left-2 w-14 h-14 rounded-xl overflow-hidden',
                    logo ? '' : 'border border-dashed border-moss-400'
                  )}
                  id="logo"
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt="logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Text size="xs" c="color-tertiary">
                      Лого
                    </Text>
                  )}
                </Flex>
              </Box>

              <Flex direction="column" gap={4} mt={12}>
                <Text size="md" c="bg-fill-inverse" fw={500}>
                  Тот самый Папас
                </Text>

                <Flex gap={4}>
                  <Text size="sm" c="color-tertiary">
                    с 10:00 до 22:00
                  </Text>
                  <Text size="sm" c="color-tertiary">
                    •
                  </Text>
                  <Text size="sm" c="color-tertiary">
                    Европейская кухня
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Center>
        </BackgroundImage>
      </Box>
    </Flex>
  )
}

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Failed to read image file'))
    }

    reader.onerror = () => {
      reject(reader.error ?? new Error('Failed to read image file'))
    }

    reader.readAsDataURL(file)
  })
