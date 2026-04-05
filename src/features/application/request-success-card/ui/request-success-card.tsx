import { Button, Card, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { FiCheck } from 'react-icons/fi'

type RequestSuccessCardProps = {
  onReset: () => void
}

export function RequestSuccessCard({ onReset }: RequestSuccessCardProps) {
  return (
    <Card
      padding="xl"
      radius="xl"
      className="border border-moss-200 bg-moss-50 shadow-lg shadow-moss-100/70"
    >
      <Stack gap="lg" align="flex-start">
        <ThemeIcon size={52} radius="xl" color="moss" variant="light">
          <FiCheck size={24} />
        </ThemeIcon>

        <Stack gap="sm">
          <Title order={3} className="text-2xl text-slate-900">
            Заявка успешно отправлена
          </Title>
          <Text size="sm" c="dimmed">
            Спасибо. Мы получили информацию о вашем бизнесе и свяжемся с вами в
            ближайшее время, чтобы обсудить подключение и следующие шаги.
          </Text>
        </Stack>

        <Button variant="light" color="moss" radius="md" onClick={onReset}>
          Отправить ещё одну заявку
        </Button>
      </Stack>
    </Card>
  )
}
