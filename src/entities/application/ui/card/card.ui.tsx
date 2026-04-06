import {
  ApplicationStatus,
  type RequestClient
} from '@/shared/api/services/application/types'
import {
  Badge,
  Card,
  CardSection,
  Divider,
  Group,
  Stack,
  Text
} from '@mantine/core'
import { applicationStatus } from '../../model/constants'
import {
  TbBuildingStore,
  TbMail,
  TbMapPin,
  TbPhone,
  TbUser
} from 'react-icons/tb'
import { BsCalendar2Date } from 'react-icons/bs'
import type { ReactNode } from 'react'
import moment from 'moment'
import { InfoRow } from '../info-row/info-row.ui'
import { DD_MM_YYYY_TIME } from '@/shared/lib/helpers/constants'

type Props = {
  data: RequestClient
  renderActions?: (item: RequestClient) => ReactNode
}

export function ApplicationCard(props: Props) {
  const { data, renderActions } = props

  const status = applicationStatus[data.status]
  const isPending = data.status === ApplicationStatus.PENDING

  return (
    <Card
      withBorder
      key={data.id}
      radius="lg"
      padding="lg"
      className="h-full bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <CardSection inheritPadding py="md" className="bg-moss-100">
        <Group justify="space-between">
          <Group gap="xs">
            <Badge color={status.color} size="lg" variant="light">
              {status.label}
            </Badge>
            {isPending ? (
              <Badge
                color="coral"
                size="lg"
                variant="dot"
                className="animate-pulse"
              >
                Новая
              </Badge>
            ) : null}
          </Group>
          {renderActions?.(data)}
        </Group>

        <Stack gap={6} mt="lg">
          <Group gap="xs" wrap="nowrap">
            <TbBuildingStore size={18} className="shrink-0 text-aurora-500" />
            <Text fw={700} fz="lg" className="wrap-break-word leading-snug">
              {data.restaurantName}
            </Text>
          </Group>

          <Text c="dimmed" fz="sm">
            Заявка на подключение ресторана
          </Text>
        </Stack>
      </CardSection>

      <Stack gap="md" mt="md">
        <InfoRow
          icon={<TbUser size={16} />}
          label="Контактное лицо"
          value={data.name}
        />
        <InfoRow icon={<TbMail size={16} />} label="Email" value={data.email} />
        <InfoRow
          icon={<TbPhone size={16} />}
          label="Телефон"
          value={data.phone}
        />
        <InfoRow
          icon={<BsCalendar2Date size={16} />}
          label="Время подачи"
          value={moment(data.createdAt).format(DD_MM_YYYY_TIME)}
        />

        <Divider />

        <InfoRow
          icon={<TbMapPin size={16} />}
          label="Адрес ресторана"
          value={data.address}
        />
      </Stack>
    </Card>
  )
}
