import { Group, Paper, Stack, Text, ThemeIcon } from '@mantine/core'
import { FORM_STEPS } from './constants'

type FormSidebarProps = {
  activeStep: number
  onStepClick: (index: number) => void
}

export function FormSidebar({ activeStep, onStepClick }: FormSidebarProps) {
  return (
    <Paper
      radius="xl"
      p="lg"
      className="h-fit border border-black/8 bg-[#f7f4ef]"
    >
      <Stack gap="md">
        <div>
          <Text size="xs" fw={700} tt="uppercase" className="text-moss-600">
            Анкета ресторана
          </Text>
          <Text className="mt-2 text-sm leading-6 text-moss-700">
            Три коротких шага: данные, доставка и оформление карточки.
          </Text>
        </div>

        {FORM_STEPS.map((step, index) => {
          const Icon = step.icon
          const isActive = index === activeStep
          const isCompleted = index < activeStep

          return (
            <button
              key={step.key}
              type="button"
              onClick={() => onStepClick(index)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                isActive
                  ? 'border-moss-900 bg-white shadow-sm'
                  : 'border-black/6 bg-white/60 hover:border-black/12'
              }`}
            >
              <Group wrap="nowrap" align="flex-start">
                <ThemeIcon
                  size={40}
                  radius="xl"
                  variant={isActive || isCompleted ? 'filled' : 'light'}
                  color={isActive || isCompleted ? 'dark' : 'gray'}
                >
                  <Icon size={18} />
                </ThemeIcon>
                <div>
                  <Text fw={600} className="text-moss-900">
                    {step.title}
                  </Text>
                  <Text size="xs" className="mt-1 leading-5 text-moss-700">
                    {step.description}
                  </Text>
                </div>
              </Group>
            </button>
          )
        })}
      </Stack>
    </Paper>
  )
}
