import { useState } from 'react'
import { Badge, Card, Stack, Text, Title, UnstyledButton } from '@mantine/core'
import { SignInForm } from '@/features/auth/sign-in'
import { SignUpForm } from '@/features/auth/sign-up'
import { authCardContent } from '../model/content'
import type { AuthMode } from '../types/auth-card.types'

export function AuthCard() {
  const [mode, setMode] = useState<AuthMode>('sign-in')

  const content = authCardContent[mode]

  const toggleMode = () => {
    setMode((currentMode) =>
      currentMode === 'sign-in' ? 'sign-up' : 'sign-in'
    )
  }

  return (
    <Card
      padding="xl"
      radius="xl"
      className="w-full max-w-md border border-white/70 bg-white/88 shadow-2xl shadow-aurora-200/40 backdrop-blur"
    >
      <Stack gap="xl">
        <div>
          <Badge
            color={mode === 'sign-in' ? 'aurora' : 'coral'}
            variant="light"
            mb="md"
          >
            {content.badge}
          </Badge>
          <Title
            order={2}
            className="text-3xl font-semibold tracking-tight text-slate-900"
          >
            {content.title}
          </Title>
        </div>

        {mode === 'sign-in' ? <SignInForm /> : <SignUpForm />}

        <Text ta="center" size="sm" c="dimmed">
          {content.toggleLabel}{' '}
          <UnstyledButton
            onClick={toggleMode}
            className="font-semibold text-(--mantine-color-coral-6) transition hover:text-(--mantine-color-coral-7)"
          >
            {content.toggleAction}
          </UnstyledButton>
        </Text>
      </Stack>
    </Card>
  )
}
