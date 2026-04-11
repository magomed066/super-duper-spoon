import type { MenuEditorCategoriesProps } from '@/entities/menu'
import {
  Alert,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton
} from '@mantine/core'
import { TbAlertCircle, TbBooks } from 'react-icons/tb'

type CategoryCardProps = {
  title: string
  description?: string
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}

function CategoryCard({
  title,
  description,
  active = false,
  disabled = false,
  onClick
}: CategoryCardProps) {
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
          <TbBooks size={18} />
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

function CategoryCardSkeleton({ count }: { count: number }) {
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

export function MenuCategoryPanel({
  restaurantId,
  selectedCategoryId,
  activeCategoriesCount,
  categories,
  isCategoriesLoading,
  isCategoriesError,
  categoriesErrorMessage,
  onCategorySelect
}: MenuEditorCategoriesProps) {
  return (
    <Paper
      withBorder
      radius="xl"
      p={24}
      miw={{ lg: 340 }}
      maw={{ lg: 380 }}
      w="100%"
      className="bg-white"
    >
      <Stack gap="lg">
        <div>
          <Text size="xs" fw={700} tt="uppercase" className="text-moss-600">
            Активные категории
          </Text>
          <Text size="sm" className="mt-2 text-moss-700">
            {activeCategoriesCount} категорий готовы для наполнения меню.
          </Text>
        </div>

        {!restaurantId ? (
          <Paper withBorder radius="xl" p="md" className="bg-white">
            <Text size="sm" className="text-moss-600">
              Выберите ресторан, чтобы увидеть его категории.
            </Text>
          </Paper>
        ) : isCategoriesLoading ? (
          <CategoryCardSkeleton count={5} />
        ) : isCategoriesError ? (
          <Alert
            color="coral"
            radius="md"
            title="Не удалось загрузить категории"
            icon={<TbAlertCircle size={18} />}
          >
            {categoriesErrorMessage}
          </Alert>
        ) : categories?.length ? (
          <Stack gap={8}>
            {categories.map((item) => (
              <CategoryCard
                key={item.id}
                title={item.name}
                description={
                  item.isActive
                    ? 'Категория участвует в меню.'
                    : 'Категория скрыта и не попадёт в выдачу.'
                }
                active={selectedCategoryId === item.id}
                disabled={!item.isActive}
                onClick={() => onCategorySelect(item.id)}
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
    </Paper>
  )
}
