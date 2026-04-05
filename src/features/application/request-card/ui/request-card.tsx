import { useState } from 'react'
import { Badge, Button, Card, Stack, Text, Title } from '@mantine/core'
import { FiArrowLeft } from 'react-icons/fi'
import { RequestForm } from '@/features/application/request-form'
import { RequestSuccessCard } from '@/features/application/request-success-card'

type RequestCardProps = {
  onBack: () => void
}

export function RequestCard({ onBack }: RequestCardProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)

  return (
    <Card
      padding="xl"
      radius="xl"
      className="w-full max-w-5xl border border-white/70 bg-white/88 shadow-2xl shadow-aurora-200/40 backdrop-blur"
    >
      <Stack gap="lg">
        <Button
          variant="subtle"
          color="gray"
          leftSection={<FiArrowLeft size={16} />}
          className="self-start px-0 text-slate-500 transition hover:bg-white hover:text-slate-700"
          onClick={onBack}
        >
          Назад
        </Button>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <Stack gap="lg" justify="center">
            <Badge color="coral" variant="light" w="fit-content">
              Заявка
            </Badge>

            <Stack gap="sm">
              <Title
                order={1}
                className="max-w-xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
              >
                Расскажите о вашем бизнесе. Мы свяжемся с вами и поможем
                запустить работу в системе.
              </Title>

              <Text size="lg" c="dimmed" className="max-w-2xl">
                Оставьте контакты, название ресторана и адрес. Мы изучим ваш
                формат работы, покажем продукт и обсудим, как быстро подключить
                команду без лишней рутины.
              </Text>
            </Stack>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-aurora-50 p-4">
                <Text className="text-sm font-semibold text-slate-900">
                  Быстрый контакт
                </Text>
                <Text size="sm" c="dimmed" mt={6}>
                  Ответим, уточним детали и предложим следующий шаг.
                </Text>
              </div>

              <div className="rounded-2xl bg-coral-50 p-4">
                <Text className="text-sm font-semibold text-slate-900">
                  Под ваш формат
                </Text>
                <Text size="sm" c="dimmed" mt={6}>
                  Подходит для ресторана, кафе, dark kitchen и сети точек.
                </Text>
              </div>

              <div className="rounded-2xl bg-moss-50 p-4">
                <Text className="text-sm font-semibold text-slate-900">
                  Без сложного старта
                </Text>
                <Text size="sm" c="dimmed" mt={6}>
                  Поможем пройти путь от заявки до первых рабочих процессов.
                </Text>
              </div>
            </div>
          </Stack>

          <Card
            padding="lg"
            radius="xl"
            className="border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50"
          >
            {isSubmitted ? (
              <RequestSuccessCard onReset={() => setIsSubmitted(false)} />
            ) : (
              <Stack gap="lg">
                <div>
                  <Title order={3} className="text-2xl text-slate-900">
                    Заявка на подключение
                  </Title>
                  <Text size="sm" c="dimmed" mt={6}>
                    Заполните короткую форму, и мы вернёмся с ответом.
                  </Text>
                </div>

                <RequestForm onSuccess={() => setIsSubmitted(true)} />
              </Stack>
            )}
          </Card>
        </div>
      </Stack>
    </Card>
  )
}
