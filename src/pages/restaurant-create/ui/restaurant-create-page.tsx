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

      <section className="px-5 py-6">
        <div className="mx-auto flex min-h-[calc(100vh-13rem)] w-full max-w-5xl items-center justify-center">
          <Card
            padding="xl"
            radius="20px"
            className="w-full border border-black/8 bg-white "
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
                  Данные ресторана
                </Title>
                <Text size="sm" className="mt-2 leading-6 text-moss-700">
                  Заполните форму для создания ресторана.
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
