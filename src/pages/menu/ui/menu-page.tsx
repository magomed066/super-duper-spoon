import {
  AuthPermission,
  getDefaultRouteByRole,
  getRouteFallback,
  hasPermission,
  useAuthStore
} from '@/entities/auth'
import { useCategoriesQuery } from '@/entities/category'
import { useRestaurantsListQuery } from '@/entities/restaurant'
import { ROUTES } from '@/shared/config/routes'
import { mapSelectData } from '@/shared/lib/helpers/arrays'
import { useQueryParams } from '@/shared/lib/hooks/use-query-params'
import type { QueryParamConfig } from '@/shared/lib/query-string'
import PageHeaderWidget from '@/widgets/page-header'
import {
  Alert,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Paper,
  Select,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  UnstyledButton
} from '@mantine/core'
import { Navigate } from 'react-router'
import {
  TbAlertCircle,
  TbBooks,
  TbCategory,
  TbCopy,
  TbInfoCircle,
  TbLayoutSidebarLeftExpand,
  //   TbLayoutSquares,
  TbPlus,
  TbSoup
} from 'react-icons/tb'
import type { ComponentType } from 'react'
import NoActiveRestaurant from '@/entities/restaurant/ui/no-active-restaurant/no-active-restaurant.ui'

type MenuPageQuery = {
  restaurantId: string
  section: string
  categoryId: string
}

const menuPageQueryConfig: QueryParamConfig<MenuPageQuery> = {
  restaurantId: {
    parse: (value) => value?.trim() ?? '',
    serialize: (value) => value.trim() || undefined
  },
  section: {
    parse: (value) => value?.trim() ?? 'dishes',
    serialize: (value) =>
      value.trim() && value !== 'dishes' ? value : undefined
  },
  categoryId: {
    parse: (value) => value?.trim() ?? '',
    serialize: (value) => value.trim() || undefined
  }
}

const editorSections = [
  {
    id: 'dishes',
    title: 'Блюда',
    description: 'Основные позиции меню и их наполнение.',
    icon: TbSoup
  },
  {
    id: 'addons',
    title: 'Добавки',
    description: 'Соусы, топпинги и дополнительные опции.',
    icon: TbPlus
  },
  {
    id: 'categories',
    title: 'Категории',
    description: 'Структура разделов меню и порядок отображения.',
    icon: TbCategory
  },
  {
    id: 'order-extras',
    title: 'Добавить к заказу',
    description: 'Дополнительные предложения перед оформлением заказа.',
    icon: TbCategory
  }
] as const

type MenuSelectCardProps = {
  title: string
  description?: string
  active?: boolean
  disabled?: boolean
  onClick?: () => void
  icon: ComponentType<{ size?: number }>
}

function MenuSelectCard({
  title,
  description,
  active = false,
  disabled = false,
  onClick,
  icon: Icon
}: MenuSelectCardProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
        active
          ? 'border-moss-900 bg-moss-900 text-white shadow-sm'
          : disabled
          ? 'cursor-not-allowed border-black/6 bg-black/3 text-moss-400'
          : 'border-black/8 bg-white hover:border-black/14 hover:bg-[#faf7f2]'
      }`}
    >
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon
          size={42}
          radius="xl"
          variant={active ? 'white' : 'light'}
          color={active ? 'dark' : 'gray'}
        >
          <Icon size={18} />
        </ThemeIcon>

        <Stack gap={4} className="min-w-0 flex-1">
          <Text fw={600} className={active ? 'text-white' : 'text-moss-900'}>
            {title}
          </Text>
          {description ? (
            <Text
              size="xs"
              className={active ? 'text-white/75' : 'leading-5 text-moss-600'}
            >
              {description}
            </Text>
          ) : null}
        </Stack>
      </Group>
    </UnstyledButton>
  )
}

function MenuSelectCardSkeleton({ count }: { count: number }) {
  return (
    <Stack gap={8}>
      {Array.from({ length: count }).map((_, index) => (
        <Paper key={index} withBorder radius="xl" p="md">
          <Group wrap="nowrap" align="flex-start">
            <Skeleton height={42} circle />
            <Stack gap={6} className="flex-1">
              <Skeleton height={14} width="50%" radius="xl" />
              <Skeleton height={10} width="80%" radius="xl" />
            </Stack>
          </Group>
        </Paper>
      ))}
    </Stack>
  )
}

export function MenuPage() {
  const user = useAuthStore((state) => state.user)
  const canViewMenu = hasPermission(user, AuthPermission.VIEW_MENU)
  const { params, setParams } = useQueryParams(menuPageQueryConfig)
  const { restaurantId, section, categoryId } = params

  const {
    data: restaurants,
    error: restaurantsError,
    isError: isRestaurantsError,
    isLoading: isRestaurantsLoading
  } = useRestaurantsListQuery(canViewMenu, { limit: 1000 }, (data) =>
    data.pages.flatMap((page) => page.items || [])
  )

  const {
    data: categories,
    error: categoriesError,
    isError: isCategoriesError,
    isLoading: isCategoriesLoading
  } = useCategoriesQuery(restaurantId, Boolean(restaurantId))

  const restaurantOptions = mapSelectData(restaurants, 'id', 'name')
  const selectedRestaurant = restaurants?.find(
    (item) => item.id === restaurantId
  )
  const activeCategories = categories?.filter((item) => item.isActive) ?? []
  const selectedSection =
    editorSections.find((item) => item.id === section) ?? editorSections[0]
  const selectedCategory = categories?.find((item) => item.id === categoryId)
  const SelectedSectionIcon = selectedSection.icon

  const handleRestaurantSelect = (id: string | null) => {
    setParams({
      restaurantId: id ?? '',
      section: 'dishes',
      categoryId: ''
    })
  }

  const handleSectionSelect = (nextSection: string) => {
    setParams({
      section: nextSection,
      categoryId: ''
    })
  }

  const handleCategorySelect = (nextCategoryId: string) => {
    setParams({
      section: 'dishes',
      categoryId: nextCategoryId
    })
  }

  if (!canViewMenu) {
    return (
      <Navigate
        to={user ? getDefaultRouteByRole(user) : getRouteFallback(ROUTES.MENU)}
        replace
      />
    )
  }

  return (
    <Stack pb={20}>
      <PageHeaderWidget items={[{ label: 'Меню' }]} />

      <Stack className="px-5" gap="lg">
        <Text maw={840} className="text-moss-700">
          Настройте структуру меню ресторана: выберите раздел для
          редактирования, проверьте активные категории и подготовьте наполнение
          для блюд.
        </Text>

        <Select
          label="Ресторан"
          placeholder="Выберите ресторан"
          data={restaurantOptions}
          value={restaurantId || null}
          onChange={handleRestaurantSelect}
          searchable
          error={restaurantsError?.message}
          loading={!isRestaurantsError && isRestaurantsLoading}
          nothingFoundMessage="Рестораны не найдены"
          disabled={!isRestaurantsLoading && restaurantOptions.length === 0}
          className="max-w-xl"
        />

        {!restaurantId ? (
          <NoActiveRestaurant />
        ) : isRestaurantsError ? (
          <Alert
            color="coral"
            radius="md"
            title="Не удалось загрузить рестораны"
            icon={<TbAlertCircle size={18} />}
          >
            {restaurantsError?.message}
          </Alert>
        ) : (
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            align="stretch"
            gap="lg"
          >
            <Paper
              withBorder
              radius="xl"
              p={24}
              miw={{ lg: 340 }}
              maw={{ lg: 380 }}
              w="100%"
              className="bg-white"
            >
              <Box>
                <Stack gap="lg">
                  <Stack gap={8}>
                    <Text
                      size="xs"
                      fw={700}
                      tt="uppercase"
                      className="text-moss-600"
                    >
                      Редактировать
                    </Text>

                    <Stack gap={8}>
                      {editorSections.map((item) => (
                        <MenuSelectCard
                          key={item.id}
                          title={item.title}
                          description={item.description}
                          active={selectedSection.id === item.id && !categoryId}
                          onClick={() => handleSectionSelect(item.id)}
                          icon={item.icon}
                        />
                      ))}
                    </Stack>
                  </Stack>

                  <Stack gap="sm">
                    <Group gap={6}>
                      <Text fw={600} className="text-moss-800">
                        Советы по заполнению
                      </Text>

                      <Tooltip label="Сначала выберите ресторан, затем проверьте активные категории и только после этого переходите к наполнению блюд.">
                        <span className="inline-flex">
                          <TbInfoCircle size={16} className="text-moss-500" />
                        </span>
                      </Tooltip>
                    </Group>

                    <Text size="sm" className="leading-6 text-moss-700">
                      Держите структуру меню компактной: активируйте только те
                      категории, которые готовы к публикации и уже содержат
                      понятные названия.
                    </Text>
                  </Stack>

                  <Button
                    leftSection={<TbCopy size={18} />}
                    variant="filled"
                    color="dark"
                    h={44}
                    radius="xl"
                    disabled
                  >
                    Скопировать меню
                  </Button>

                  <Divider color="rgba(0,0,0,0.08)" />

                  <Stack gap={8}>
                    <Group justify="space-between">
                      <Text size="sm" className="text-moss-600">
                        Активные категории
                      </Text>
                      <Text size="sm" fw={600} className="text-moss-700">
                        {activeCategories.length}
                      </Text>
                    </Group>

                    {!restaurantId ? (
                      <Paper withBorder radius="xl" p="md" className="bg-white">
                        <Text size="sm" className="text-moss-600">
                          Выберите ресторан, чтобы увидеть его категории.
                        </Text>
                      </Paper>
                    ) : isCategoriesLoading ? (
                      <MenuSelectCardSkeleton count={5} />
                    ) : isCategoriesError ? (
                      <Alert
                        color="coral"
                        radius="md"
                        title="Не удалось загрузить категории"
                        icon={<TbAlertCircle size={18} />}
                      >
                        {categoriesError?.message}
                      </Alert>
                    ) : categories?.length ? (
                      <Stack gap={8}>
                        {categories.map((item) => (
                          <MenuSelectCard
                            key={item.id}
                            title={item.name}
                            description={
                              item.isActive
                                ? 'Категория участвует в меню.'
                                : 'Категория скрыта и не попадёт в выдачу.'
                            }
                            active={categoryId === item.id}
                            disabled={!item.isActive}
                            onClick={() => handleCategorySelect(item.id)}
                            icon={TbBooks}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Paper withBorder radius="xl" p="md" className="bg-white">
                        <Text size="sm" className="text-moss-600">
                          Для выбранного ресторана пока нет категорий.
                        </Text>
                      </Paper>
                    )}
                  </Stack>
                </Stack>
              </Box>
            </Paper>

            <Paper
              withBorder
              radius="xl"
              className="min-h-[560px] flex-1 bg-white"
            >
              <Box p={32}>
                {!restaurantId ? (
                  <Flex h="100%" align="center" justify="center">
                    <Stack align="center" gap="md" maw={520} ta="center">
                      <ThemeIcon
                        size={64}
                        radius="xl"
                        variant="light"
                        color="gray"
                      >
                        <TbLayoutSidebarLeftExpand size={30} />
                      </ThemeIcon>
                      <Stack gap={6}>
                        <Title order={3} className="text-moss-900">
                          Выберите ресторан
                        </Title>
                        <Text className="text-moss-600">
                          После выбора ресторана слева появятся его активные
                          категории, а здесь можно будет перейти к настройке
                          структуры меню.
                        </Text>
                      </Stack>
                    </Stack>
                  </Flex>
                ) : (
                  <Stack gap="xl">
                    <Stack gap={8}>
                      <Group gap="sm">
                        <ThemeIcon
                          size={48}
                          radius="xl"
                          variant="light"
                          color="dark"
                        >
                          <SelectedSectionIcon size={22} />
                        </ThemeIcon>
                        <div>
                          <Text size="sm" className="text-moss-600">
                            {selectedRestaurant?.name ?? 'Выбранный ресторан'}
                          </Text>
                          <Title order={2} className="text-moss-900">
                            {selectedCategory?.name ?? selectedSection.title}
                          </Title>
                        </div>
                      </Group>

                      <Text maw={760} className="leading-7 text-moss-700">
                        {selectedCategory
                          ? selectedCategory.description?.trim() ||
                            'Описание категории пока не заполнено. Здесь можно подготовить рабочую область для наполнения блюд и контроля состава.'
                          : selectedSection.description}
                      </Text>
                    </Stack>

                    <Divider color="rgba(0,0,0,0.08)" />

                    {selectedCategory ? (
                      <Paper
                        withBorder
                        radius="xl"
                        p="xl"
                        className="bg-[#faf7f2]"
                      >
                        <Stack gap="md">
                          <Title order={4} className="text-moss-900">
                            Категория выбрана для редактирования
                          </Title>
                          <Text className="text-moss-700">
                            Следующий шаг: подключить список блюд, фильтрацию по
                            категории и формы редактирования позиций. Базовая
                            навигация для сценария уже готова.
                          </Text>
                        </Stack>
                      </Paper>
                    ) : (
                      <Flex gap="md" direction={{ base: 'column', md: 'row' }}>
                        <Paper
                          withBorder
                          radius="xl"
                          p="xl"
                          className="flex-1 bg-[#faf7f2]"
                        >
                          <Stack gap={10}>
                            <Text
                              size="xs"
                              fw={700}
                              tt="uppercase"
                              className="text-moss-600"
                            >
                              Что можно сделать
                            </Text>
                            <Title order={4} className="text-moss-900">
                              {selectedSection.title}
                            </Title>
                            <Text className="leading-7 text-moss-700">
                              {selectedSection.id === 'categories'
                                ? 'Проверьте порядок категорий, их названия и статус активности. Это основа для дальнейшего наполнения меню.'
                                : 'Подготовьте сценарий редактирования раздела, а затем выберите конкретную активную категорию слева для более детальной работы.'}
                            </Text>
                          </Stack>
                        </Paper>

                        <Paper withBorder radius="xl" p="xl" className="flex-1">
                          <Stack gap={10}>
                            <Text
                              size="xs"
                              fw={700}
                              tt="uppercase"
                              className="text-moss-600"
                            >
                              Состояние меню
                            </Text>
                            <Title order={4} className="text-moss-900">
                              {activeCategories.length} активных категорий
                            </Title>
                            <Text className="leading-7 text-moss-700">
                              Если категории ещё не готовы, начните с их
                              настройки. После этого можно подключать блюда и
                              дополнять структуру меню более точными сущностями.
                            </Text>
                          </Stack>
                        </Paper>
                      </Flex>
                    )}
                  </Stack>
                )}
              </Box>
            </Paper>
          </Flex>
        )}

        {}
      </Stack>
    </Stack>
  )
}
