import { useState } from 'react'
import { TbLogout2 } from 'react-icons/tb'
import { Button, Code, Group } from '@mantine/core'
import { useLogoutMutation } from '@/entities/auth/model/hooks'
import { AuthPermission, hasPermission, useAuthStore } from '@/entities/auth'
import { Link, useLocation } from 'react-router'
import { ROUTES } from '@/shared/config/routes'
import { FaListCheck } from 'react-icons/fa6'
import { IoMailOpenOutline } from 'react-icons/io5'
import cn from 'classnames'

const data = [
  {
    link: ROUTES.APPLICATIONS,
    label: 'Заявки',
    icon: () => <IoMailOpenOutline size={18} />,
    permission: AuthPermission.VIEW_APPLICATIONS
  },
  {
    link: ROUTES.RESTAURANTS,
    label: 'Рестораны',
    icon: () => <FaListCheck size={18} />,
    permission: AuthPermission.VIEW_RESTAURANTS
  }
]

export function Sidebar() {
  const location = useLocation()
  const [active, setActive] = useState(location.pathname)

  const { refreshToken, user } = useAuthStore()

  const { mutate } = useLogoutMutation()

  const handleLogout = () => {
    if (refreshToken) {
      mutate({ refreshToken })
    }
  }

  const visibleLinks = data.filter((item) => hasPermission(user, item.permission))

  const links = visibleLinks.map((item) => (
    <Link
      to={item.link}
      className={cn(
        'p-2.5 transition hover:bg-aurora-500 hover:text-white rounded-md flex items-center gap-3',
        active === item.link && 'bg-aurora-500 text-white'
      )}
      key={item.label}
      onClick={() => {
        setActive(item.link)
      }}
    >
      {item.icon()}
      <span>{item.label}</span>
    </Link>
  ))

  return (
    <nav className="w-full flex-1 flex flex-col">
      <div className="flex-1">
        <Group
          className="flex border-b border-moss-300 p-3"
          justify="space-between"
        >
          Admin Panel
          <Code fw={700}>v3.1.2</Code>
        </Group>

        <div className="p-3 mt-auto flex flex-col">{links}</div>
      </div>

      <div className="py-2 border-t border-moss-300">
        <Button variant="transparent" onClick={handleLogout}>
          <TbLogout2 className="mr-2" size={18} />
          <span className="text-moss-900">Выйти из системы</span>
        </Button>
      </div>
    </nav>
  )
}
