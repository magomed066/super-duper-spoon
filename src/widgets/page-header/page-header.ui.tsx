import { Title } from '@mantine/core'

type Props = {
  title: string
}

export function PageHeaderWidget(props: Props) {
  const { title } = props
  return (
    <div className="bg-white px-5 py-7 h-20">
      <Title order={3} className="text-moss-900">
        {title}
      </Title>
    </div>
  )
}
