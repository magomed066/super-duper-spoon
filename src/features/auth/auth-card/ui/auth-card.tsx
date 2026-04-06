import { Badge, Card, Stack, Text, Title } from '@mantine/core'
import { SignInForm } from '@/features/auth/sign-in'
import { authCardContent } from '../model/content'
import { Link } from 'react-router'
import { ROUTES } from '@/shared/config/routes'

export function AuthCard() {
  const content = authCardContent['sign-in']

  return (
    <Card
      padding="xl"
      radius="xl"
      className="w-full max-w-md border border-moss-200 bg-white/94 shadow-2xl shadow-aurora-100/20 backdrop-blur"
    >
      <Stack gap="xl">
        <div>
          <Badge color="aurora" variant="light" mb="md">
            {content.badge}
          </Badge>
          <Title
            order={2}
            className="text-3xl font-semibold tracking-tight text-[#10131f]"
          >
            {content.title}
          </Title>
        </div>

        <SignInForm />

        <Text ta="center" size="m" c="dimmed">
          {content.toggleLabel}{' '}
          <Link
            to={ROUTES.REQUEST}
            className="font-semibold text-(--mantine-color-aurora-5) transition hover:text-(--mantine-color-aurora-7)"
          >
            {content.toggleAction}
          </Link>
        </Text>
      </Stack>
    </Card>
  )
}
