import { TbLogout2 } from 'react-icons/tb'
import { Button, Text } from '@mantine/core'
import { useLogoutMutation } from '@/entities/auth/model/hooks'
import {
  AuthPermission,
  PlatformPermission,
  hasPermission,
  useAuthStore
} from '@/entities/auth'
import { NavLink } from 'react-router'
import { ROUTES } from '@/shared/config/routes'
import { FaListCheck } from 'react-icons/fa6'
import { IoMailOpenOutline } from 'react-icons/io5'
import cn from 'classnames'
import type { ReactNode } from 'react'
import { UserRole } from '@/shared/api/services/auth/types'
import { BiFoodMenu } from 'react-icons/bi'
import { FaTasks } from 'react-icons/fa'

type SidebarItem = {
  link: string
  label: string
  icon: () => ReactNode
  permission: PlatformPermission
}

const data: SidebarItem[] = [
  {
    link: ROUTES.APPLICATIONS,
    label: 'Заявки',
    icon: () => <IoMailOpenOutline size={20} />,
    permission: AuthPermission.VIEW_APPLICATIONS
  },
  {
    link: ROUTES.RESTAURANTS,
    label: 'Рестораны',
    icon: () => <FaListCheck size={20} />,
    permission: AuthPermission.VIEW_RESTAURANTS
  },
  {
    link: ROUTES.MENU,
    label: 'Меню',
    icon: () => <BiFoodMenu size={20} />,
    permission: AuthPermission.VIEW_MENU
  },
  {
    link: ROUTES.ORDERS,
    label: 'Заказы',
    icon: () => <FaTasks size={20} />,
    permission: AuthPermission.VIEW_ORDERS
  }
]

export function Sidebar() {
  const { refreshToken, user } = useAuthStore()

  const { mutate } = useLogoutMutation()

  const handleLogout = () => {
    if (refreshToken) {
      mutate({ refreshToken })
    }
  }

  const visibleLinks = data.filter((item) =>
    hasPermission(user, item.permission)
  )

  const roleLabel = user
    ? {
        [UserRole.SYSTEM_OWNER]: 'Владелец системы',
        [UserRole.CLIENT]: 'Владелец ресторана',
        [UserRole.STAFF]: 'Сотрудник'
      }[user.role]
    : null

  const initials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : 'DA'

  const links = visibleLinks.map((item) => (
    <NavLink
      to={item.link}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors',
          isActive
            ? 'bg-moss-50 text-moss-900 ring-1 ring-moss-200'
            : 'text-moss-700 hover:bg-moss-100 hover:text-moss-900'
        )
      }
      key={item.label}
    >
      {({ isActive }) => (
        <>
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
              isActive
                ? 'bg-white text-aurora-700 shadow-sm'
                : 'bg-white text-moss-600 group-hover:bg-white group-hover:text-moss-900'
            )}
          >
            {item.icon()}
          </div>

          <div className="min-w-0 flex-1">
            <Text
              fw={600}
              className={cn('truncate text-[15px]', 'text-moss-900')}
            >
              {item.label}
            </Text>
          </div>

          <div
            className={cn(
              'h-1.5 w-1.5 rounded-full transition-colors',
              isActive
                ? 'bg-aurora-500'
                : 'bg-transparent group-hover:bg-moss-400'
            )}
          />
        </>
      )}
    </NavLink>
  ))

  return (
    <nav className="flex h-full w-full flex-col border-r border-black/6 bg-white px-4 py-5">
      <div className="border-b border-black/6 pb-5">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-moss-50 text-sm font-semibold text-moss-900 ring-1 ring-moss-200">
            {initials}
          </div>
          <div className="min-w-0">
            <Text size="xs" fw={700} tt="uppercase" className="text-moss-500">
              Delivery app
            </Text>
            <Text fw={700} className="truncate text-lg text-moss-900">
              Панель управления
            </Text>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <Text size="xs" fw={700} tt="uppercase" className="px-2 text-moss-500">
          Навигация
        </Text>
        <div className="mt-3 flex flex-col gap-1.5">{links}</div>
      </div>

      <div className="mt-auto border-t border-black/6 pt-4">
        <div className="rounded-2xl bg-white p-3">
          <div className="flex items-center gap-3 px-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-moss-100 text-sm font-semibold text-moss-900">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <Text fw={600} className="truncate text-moss-900">
                {user ? `${user.firstName} ${user.lastName}` : 'Delivery App'}
              </Text>
              <Text size="xs" className="mt-1 truncate text-moss-600">
                {roleLabel ?? 'Авторизованный пользователь'}
              </Text>
              {user?.email ? (
                <Text size="xs" className="mt-1 truncate text-moss-500">
                  {user.email}
                </Text>
              ) : null}
            </div>
          </div>

          <Button
            variant="light"
            color="coral"
            fullWidth
            mt="md"
            radius="md"
            onClick={handleLogout}
            leftSection={<TbLogout2 size={18} />}
            className="bg-moss-100 text-moss-900 hover:bg-moss-200"
          >
            Выйти из системы
          </Button>
        </div>
      </div>
    </nav>
  )
}
