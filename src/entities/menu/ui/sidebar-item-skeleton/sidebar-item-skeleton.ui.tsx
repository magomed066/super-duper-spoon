import { Paper, Skeleton, Stack } from '@mantine/core'

export function MenuSidebarItemSkeleton({ count }: { count: number }) {
  return (
    <Stack gap={8}>
      {Array.from({ length: count }).map((_, index) => (
        <Paper key={index} radius="md" p="md">
          <Stack gap={6}>
            <Skeleton height={14} width="55%" radius="xl" />
            <Skeleton height={10} width="82%" radius="xl" />
          </Stack>
        </Paper>
      ))}
    </Stack>
  )
}
