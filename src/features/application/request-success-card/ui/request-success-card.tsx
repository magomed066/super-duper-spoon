import { ROUTES } from '@/shared/config/routes'
import { Button, Card, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { FiCheck } from 'react-icons/fi'
import { useNavigate } from 'react-router'

export function RequestSuccessCard() {
  const navigate = useNavigate()

  return (
    <Card
      padding="xl"
      radius="24px"
      className="w-full max-w-2xl border border-black/8 bg-[#fdfcf9] shadow-[0_24px_80px_rgba(16,19,31,0.08)]"
    >
      <Stack gap="xl" align="flex-start">
        <ThemeIcon size={56} radius="xl" variant="light" color="green">
          <FiCheck size={24} />
        </ThemeIcon>

        <Stack gap="sm">
          <Title
            order={1}
            className="text-4xl leading-tight tracking-[-0.04em]"
          >
            Заявка успешно отправлена
          </Title>
          <Text size="md" className="max-w-xl leading-7 text-moss-700">
            Спасибо. Мы получили информацию о вашем бизнесе и свяжемся с вами в
            ближайшее время, чтобы обсудить подключение и следующие шаги.
          </Text>
        </Stack>

        <div className="grid w-full gap-3 sm:grid-cols-2">
          <Button onClick={() => navigate(ROUTES.REQUEST)}>Новая заявка</Button>
          <Button variant="default" onClick={() => navigate(ROUTES.AUTH)}>
            На главный экран
          </Button>
        </div>
      </Stack>
    </Card>
  )
}
