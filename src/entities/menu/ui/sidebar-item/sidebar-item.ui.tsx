import { Box, Group, Stack, Text } from '@mantine/core'

type MenuSidebarItemProps = {
  title: string
  description?: string
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}

export function MenuSidebarItem({
  title,
  description,
  active = false,
  disabled = false,
  onClick
}: MenuSidebarItemProps) {
  return (
    <Box
      onClick={onClick}
      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
        active
          ? 'border-moss-400 bg-moss-50 text-moss-900'
          : disabled
            ? 'cursor-not-allowed border-moss-100 bg-moss-50/30 text-moss-400'
            : 'cursor-pointer border-moss-100 bg-white hover:border-moss-300 hover:bg-moss-50'
      }`}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(event) => {
        if (disabled) {
          return
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick?.()
        }
      }}
      aria-disabled={disabled}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Stack gap={4} className="min-w-0 flex-1">
          <Text fw={600} className={disabled ? 'text-moss-400' : 'text-moss-900'}>
            {title}
          </Text>

          {description ? (
            <Text size="xs" className={disabled ? 'leading-5 text-moss-400' : 'leading-5 text-moss-600'}>
              {description}
            </Text>
          ) : null}
        </Stack>
      </Group>
    </Box>
  )
}
