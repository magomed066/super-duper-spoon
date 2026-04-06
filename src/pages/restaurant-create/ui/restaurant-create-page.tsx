import { CreateRestaurantForm } from '@/features/restaurant/create-restaurant-form'
import { ROUTES } from '@/shared/config/routes'
import PageHeaderWidget from '@/widgets/page-header'
import { Button, Card, Stack, Text, Title } from '@mantine/core'
import { FiArrowLeft } from 'react-icons/fi'
import { Link } from 'react-router'

export function RestaurantCreatePage() {
  return (
    <Stack pb={20}>
      <PageHeaderWidget title="Создание ресторана" />

      <section className="bg-[radial-gradient(circle_at_top,_rgba(242,243,247,0.9),_transparent_45%),linear-gradient(180deg,#f6f3ee_0%,#f8f9fc_100%)] px-5 py-8">
        <div className="mx-auto flex min-h-[calc(100vh-13rem)] w-full max-w-6xl items-center justify-center">
          <Card
            padding="xl"
            radius="28px"
            className="w-full border border-black/8 bg-white/94 shadow-[0_24px_80px_rgba(16,19,31,0.08)] backdrop-blur"
          >
            <Stack gap="xl">
              <Button
                component={Link}
                to={ROUTES.RESTAURANTS}
                variant="transparent"
                color="dark"
                leftSection={<FiArrowLeft size={16} />}
                p={0}
                className="self-start px-0 text-moss-900"
              >
                К списку ресторанов
              </Button>

              <div className="border-b border-black/8 pb-5">
                <Title
                  order={3}
                  className="text-[28px] tracking-[-0.03em] text-moss-900"
                >
                  Регистрация ресторана
                </Title>
                <Text size="sm" className="mt-2 leading-6 text-moss-700">
                  Заполните карточку по шагам: сначала контакты, затем доставку
                  и расписание, после этого добавьте изображения.
                </Text>
              </div>

              <CreateRestaurantForm />
            </Stack>
          </Card>
        </div>
      </section>
    </Stack>
  )
}
