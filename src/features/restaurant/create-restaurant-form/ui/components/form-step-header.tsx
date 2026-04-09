import { Badge, Group, Text } from '@mantine/core'
import { FORM_STEPS } from './constants'

type FormStepHeaderProps = {
  activeStep: number
}

export function FormStepHeader({ activeStep }: FormStepHeaderProps) {
  return (
    <div className="border-b border-black/8 pb-5">
      <Group justify="space-between" align="flex-start" gap="md">
        <div>
          <Badge variant="light" color="moss" radius="sm" mb={12}>
            Шаг {activeStep + 1} из {FORM_STEPS.length}
          </Badge>
          <Text className="mt-3 text-[30px] font-semibold tracking-[-0.03em] text-moss-900">
            {FORM_STEPS[activeStep]?.title}
          </Text>
          <Text size="sm" className="mt-2 leading-6 text-moss-700">
            {FORM_STEPS[activeStep]?.description}
          </Text>
        </div>
        <Text size="sm" className="text-moss-600">
          {Math.round(((activeStep + 1) / FORM_STEPS.length) * 100)}%
        </Text>
      </Group>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-moss-100">
        <div
          className="h-full rounded-full bg-aurora-500 transition-all"
          style={{
            width: `${((activeStep + 1) / FORM_STEPS.length) * 100}%`
          }}
        />
      </div>
    </div>
  )
}
