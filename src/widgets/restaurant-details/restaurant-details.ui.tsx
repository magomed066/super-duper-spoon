import {
  RestaurantInfoRow,
  declineMinuteTitle,
  getRestaurantActivityMeta,
  getRestaurantAddress,
  getRestaurantModerationStatusMeta,
  getRestaurantPrimaryPhone,
  getRestaurantWeekdayLabel,
  useRestaurantQuery
} from '@/entities/restaurant'
import RestaurantActions from '@/features/restaurant/restaurant-actions'
import { getApiErrorMessage } from '@/shared/api/errors'
import { resolveMediaUrl } from '@/shared/lib/helpers/media'
import {
  Alert,
  Badge,
  Card,
  Divider,
  Grid,
  Group,
  Image,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core'
import { FiClock, FiEdit2, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import {
  TbAlertCircle,
  TbBuildingStore,
  TbCalendarTime,
  TbWorld
} from 'react-icons/tb'

type Props = {
  id: string
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(value))

export function RestaurantDetailsWidget({ id }: Props) {
  const { data, error, isError, isLoading } = useRestaurantQuery(
    id,
    Boolean(id)
  )

  if (isLoading) {
    return <Loader className="mx-auto mt-10" />
  }

  if (isError) {
    return (
      <Alert
        color="coral"
        radius="md"
        title="Не удалось загрузить ресторан"
        icon={<TbAlertCircle size={18} />}
      >
        {getApiErrorMessage(error)}
      </Alert>
    )
  }

  if (!data) {
    return null
  }

  const moderationStatus = getRestaurantModerationStatusMeta(data.status)
  const activityStatus = getRestaurantActivityMeta(data.isActive)
  const cuisine = data.cuisine.length
    ? data.cuisine.join(' • ')
    : 'Кухня не указана'
  const phone = getRestaurantPrimaryPhone(data)
  const address = getRestaurantAddress(data)

  return (
    <Stack gap="lg">
      <Card
        withBorder
        radius={24}
        padding={0}
        className="overflow-hidden bg-white"
      >
        <div className="relative h-72 overflow-hidden bg-moss-100">
          <Image
            src={resolveMediaUrl(data.preview)}
            alt={`Превью ресторана ${data.name}`}
            h="100%"
            w="100%"
            fit="cover"
            fallbackSrc="https://placehold.co/1200x600?text=Preview"
          />
          <div className="absolute inset-0 bg-linear-to-t from-moss-950/70 via-moss-950/20 to-transparent" />
          <Image
            src={resolveMediaUrl(data.logo)}
            alt={`Логотип ресторана ${data.name}`}
            w={96}
            h={96}
            radius="24px"
            fit="cover"
            fallbackSrc="https://placehold.co/240x240?text=Logo"
            className="absolute bottom-5 left-5 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-lg"
          />
        </div>

        <Stack gap="lg" p="xl">
          <Group gap="xs" wrap="wrap">
            <Badge color={moderationStatus.color} variant="light" size="lg">
              {moderationStatus.label}
            </Badge>
            <Badge color={activityStatus.color} variant="dot" size="lg">
              {activityStatus.label}
            </Badge>

            <div className="ml-auto">
              <Group gap="sm">
                <RestaurantActions
                  data={data}
                  actionIconProps={{
                    variant: 'light',
                    color: 'gray',
                    className: 'bg-white hover:bg-moss-50'
                  }}
                />
              </Group>
            </div>
          </Group>

          <Group justify="space-between" align="flex-start" gap="lg">
            <div>
              <Title
                order={2}
                className="text-[32px] tracking-[-0.03em] text-moss-900"
              >
                {data.name}
              </Title>
              <Text className="mt-1 text-moss-600">{cuisine}</Text>
            </div>
          </Group>

          <Text
            size="sm"
            className="w-full max-w-6xl whitespace-pre-line wrap-break-word leading-7 text-moss-700"
          >
            {data.description?.trim() ||
              'Описание ресторана пока не заполнено.'}
          </Text>
        </Stack>
      </Card>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            <Card withBorder radius={24} padding="xl" className="bg-white">
              <Group gap="sm" mb="md">
                <ThemeIcon variant="light" size={38} radius="xl">
                  <TbBuildingStore size={20} />
                </ThemeIcon>
                <div>
                  <Title order={4}>Основная информация</Title>
                  <Text size="sm" c="dimmed">
                    Контакты, адрес и параметры доставки
                  </Text>
                </div>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mt={20}>
                <RestaurantInfoRow
                  icon={<FiPhone size={16} />}
                  label="Телефон"
                  value={phone || 'Телефон не указан'}
                />
                <RestaurantInfoRow
                  icon={<FiMail size={16} />}
                  label="Email"
                  value={data.email || 'Email не указан'}
                />
                <RestaurantInfoRow
                  icon={<FiMapPin size={16} />}
                  label="Адрес"
                  value={address || 'Адрес не указан'}
                />
                <RestaurantInfoRow
                  icon={<FiClock size={16} />}
                  label="Доставка"
                  value={declineMinuteTitle(data.deliveryTime)}
                />
              </SimpleGrid>

              <Divider my="lg" />

              <Stack gap="sm">
                <Text
                  size="md"
                  fw={600}
                  className="text-moss-900"
                  tt="uppercase"
                >
                  Условия доставки
                </Text>
                <Text size="sm" className="leading-7 text-moss-700">
                  {data.deliveryConditions || 'Условия доставки не указаны'}
                </Text>
              </Stack>
            </Card>

            <Card withBorder radius={24} padding="xl" className="bg-white">
              <Group gap="sm" mb="md">
                <ThemeIcon variant="light" size={38} radius="xl">
                  <TbCalendarTime size={20} />
                </ThemeIcon>
                <div>
                  <Title order={4}>Расписание</Title>
                  <Text size="sm" c="dimmed">
                    Актуальные часы работы ресторана
                  </Text>
                </div>
              </Group>

              <Stack gap="sm">
                {data.workSchedule.length ? (
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                    {data.workSchedule.map((item) => (
                      <Card
                        key={`${item.day}-${item.open}-${item.close}`}
                        radius="xl"
                        padding="md"
                        className="bg-moss-50"
                      >
                        <Group justify="space-between" gap="sm">
                          <Text fw={600}>
                            {getRestaurantWeekdayLabel(item.day)}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {item.open} - {item.close}
                          </Text>
                        </Group>
                      </Card>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text size="sm" c="dimmed">
                    Расписание пока не заполнено.
                  </Text>
                )}
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="lg">
            <Card withBorder radius={24} padding="xl" className="bg-white">
              <Title order={4}>Статус и публикация</Title>
              <Stack gap="sm" mt="md">
                <RestaurantInfoRow
                  icon={<TbAlertCircle size={16} />}
                  label="Модерация"
                  value={moderationStatus.label}
                />
                <RestaurantInfoRow
                  icon={<TbWorld size={16} />}
                  label="Публикация"
                  value={activityStatus.label}
                />
                <RestaurantInfoRow
                  icon={<FiClock size={16} />}
                  label="Создан"
                  value={formatDate(data.createdAt)}
                />
                <RestaurantInfoRow
                  icon={<FiEdit2 size={16} />}
                  label="Обновлён"
                  value={formatDate(data.updatedAt)}
                />
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
