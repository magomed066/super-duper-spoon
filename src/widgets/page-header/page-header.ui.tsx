import { Anchor, Breadcrumbs, Text } from '@mantine/core'
import { Fragment } from 'react'
import { Link } from 'react-router'

type Props = {
  items: BreadcrumbItem[]
}

export type BreadcrumbItem = {
  label: string
  href?: string
}

export function PageHeaderWidget(props: Props) {
  const { items } = props
  return (
    <div className="bg-white px-5 py-7 min-h-20">
      <Breadcrumbs separator="/" className="text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <Fragment key={`${item.label}-${index}`}>
              {item.href && !isLast ? (
                <Anchor
                  component={Link}
                  to={item.href}
                  underline="never"
                  c="inherit"
                  className="text-moss-600! visited:text-moss-600! transition-colors hover:text-moss-900!"
                >
                  {item.label}
                </Anchor>
              ) : (
                <Text
                  span
                  className={
                    isLast ? 'font-semibold text-moss-900' : 'text-moss-600'
                  }
                >
                  {item.label}
                </Text>
              )}
            </Fragment>
          )
        })}
      </Breadcrumbs>
    </div>
  )
}
