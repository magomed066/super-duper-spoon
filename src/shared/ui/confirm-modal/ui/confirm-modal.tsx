import { Button, Group, Modal, Stack, Text, type MantineColor } from '@mantine/core'
import type { ReactNode } from 'react'

type Props = {
  opened: boolean
  title: ReactNode
  description: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: MantineColor
  loading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmModal({
  opened,
  title,
  description,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Отмена',
  confirmColor = 'aurora',
  loading = false,
  onClose,
  onConfirm
}: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      radius="lg"
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
      withCloseButton={!loading}
    >
      <Stack gap="lg">
        <Text c="dimmed" fz="sm">
          {description}
        </Text>

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button color={confirmColor} loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
