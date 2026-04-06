import { Button, Card, Stack, Text, Title } from '@mantine/core'
import { FiArrowLeft } from 'react-icons/fi'
import { RequestForm } from '@/features/application/request-form'
import { useNavigate } from 'react-router'

export function RequestCard() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center">
      <Card
        padding="xl"
        radius="24px"
        className="w-full border border-black/8 bg-[#fdfcf9] shadow-[0_24px_80px_rgba(16,19,31,0.08)]"
      >
        <Stack gap="xl">
          <Button
            variant="transparent"
            color="dark"
            leftSection={<FiArrowLeft size={16} />}
            p={0}
            className="self-start px-0 text-moss-900"
            onClick={handleBack}
          >
            Назад
          </Button>

          <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <Stack gap="xl" className="max-w-2xl">
              <Stack gap="md">
                <Title
                  order={1}
                  className="max-w-xl text-4xl leading-tight font-semibold tracking-[-0.04em] text-moss-900 sm:text-5xl"
                >
                  Подайте заявку на подключение без лишних шагов.
                </Title>

                <Text size="lg" className="max-w-xl leading-8 text-moss-700">
                  Оставьте базовую информацию о ресторане. Мы свяжемся с вами,
                  покажем систему и предложим сценарий запуска под ваш формат
                  работы.
                </Text>
              </Stack>

              <div className="grid gap-6 border-t border-black/8 pt-6 sm:grid-cols-3">
                <div>
                  <Text className="text-sm font-semibold tracking-[-0.02em] text-moss-900">
                    01
                  </Text>
                  <Text size="sm" className="mt-2 leading-6 text-moss-700">
                    Ответим после получения заявки и уточним контекст.
                  </Text>
                </div>

                <div>
                  <Text className="text-sm font-semibold tracking-[-0.02em] text-moss-900">
                    02
                  </Text>
                  <Text size="sm" className="mt-2 leading-6 text-moss-700">
                    Покажем продукт и обсудим внедрение без перегруза.
                  </Text>
                </div>

                <div>
                  <Text className="text-sm font-semibold tracking-[-0.02em] text-moss-900">
                    03
                  </Text>
                  <Text size="sm" className="mt-2 leading-6 text-moss-700">
                    Подойдёт для одного заведения и для сети точек.
                  </Text>
                </div>
              </div>
            </Stack>

            <Card
              padding="xl"
              radius="20px"
              className="border border-black/8 bg-white shadow-[0_20px_60px_rgba(16,19,31,0.06)]"
            >
              <Stack gap="lg">
                <div className="border-b border-black/8 pb-5">
                  <Title
                    order={3}
                    className="text-[28px] tracking-[-0.03em] text-moss-900"
                  >
                    Короткая форма
                  </Title>
                  <Text size="sm" className="mt-2 leading-6 text-moss-700">
                    Только контакты и информация о точке. Остальное обсудим уже
                    в разговоре.
                  </Text>
                </div>

                <RequestForm />
              </Stack>
            </Card>
          </div>
        </Stack>
      </Card>
    </section>
  )
}
