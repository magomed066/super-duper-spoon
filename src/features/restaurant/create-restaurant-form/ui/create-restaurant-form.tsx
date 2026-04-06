import { useState } from 'react'
import { useForm } from '@mantine/form'
import { Button, Group, Paper, Stack } from '@mantine/core'
import {
  createRestaurantSchema,
  useCreateRestaurantMutation,
  validateCreateRestaurantForm,
  type CreateRestaurantFormValues
} from '@/entities/restaurant'
import { BasicInfoStep } from './components/basic-info-step'
import {
  BASIC_STEP_FIELDS,
  DELIVERY_STEP_FIELDS,
  FORM_STEPS,
  WEEK_DAYS
} from './components/constants'
import { DeliveryScheduleStep } from './components/delivery-schedule-step'
import { FormStepHeader } from './components/form-step-header'
import { MediaStep } from './components/media-step'

const initialValues: CreateRestaurantFormValues = {
  name: '',
  logo: '',
  preview: '',
  phone: '',
  address: '',
  description: '',
  email: '',
  city: '',
  deliveryTime: '',
  deliveryConditions: '',
  cuisine: '',
  workSchedule: WEEK_DAYS.map(({ day }) => ({
    day,
    enabled: false,
    open: '09:00',
    close: '22:00'
  }))
}

export function CreateRestaurantForm() {
  const [activeStep, setActiveStep] = useState(0)
  const form = useForm<CreateRestaurantFormValues>({
    initialValues,
    validate: validateCreateRestaurantForm,
    validateInputOnBlur: true
  })

  const { mutate, isPending } = useCreateRestaurantMutation(() => {
    form.reset()
  })

  const canSubmit = createRestaurantSchema.safeParse(form.values).success

  const handleUpload = (file: File, uploadType?: 'logo' | 'preview') => {
    if (!uploadType) {
      return
    }

    form.setFieldValue(uploadType, URL.createObjectURL(file))
  }

  const handleSubmit = (data: CreateRestaurantFormValues) => {
    mutate({
      ...data,
      email: data.email.trim() || undefined,
      city: data.city.trim() || undefined,
      logo: data.logo.trim() || undefined,
      preview: data.preview.trim() || undefined,
      deliveryTime: data.deliveryTime ? Number(data.deliveryTime) : undefined,
      deliveryConditions: data.deliveryConditions.trim() || undefined,
      cuisine: data.cuisine
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      workSchedule: data.workSchedule
        .filter((item) => item.enabled)
        .map(({ day, open, close }) => ({
          day,
          open,
          close
        }))
    })
  }

  const validateStep = (step: number) => {
    if (step === 0) {
      return BASIC_STEP_FIELDS.every(
        (field) => !form.validateField(field).hasError
      )
    }

    if (step === 1) {
      return DELIVERY_STEP_FIELDS.every(
        (field) => !form.validateField(field).hasError
      )
    }

    return true
  }

  const goNextStep = () => {
    if (!validateStep(activeStep)) {
      return
    }

    setActiveStep((current) => Math.min(current + 1, FORM_STEPS.length - 1))
  }

  const goPrevStep = () => {
    setActiveStep((current) => Math.max(current - 1, 0))
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Paper
        radius="24px"
        p="xl"
        className="border border-black/8 bg-white shadow-[0_18px_60px_rgba(16,19,31,0.08)]"
      >
        <Stack gap="xl">
          <FormStepHeader activeStep={activeStep} />

          {activeStep === 0 && <BasicInfoStep form={form} />}
          {activeStep === 1 && <DeliveryScheduleStep form={form} />}
          {activeStep === 2 && (
            <MediaStep
              defaultLogo={form.values.logo}
              defaultPreview={form.values.preview}
              isPending={isPending}
              onUpload={handleUpload}
            />
          )}

          <Group justify="space-between" pt="sm">
            <Button
              type="button"
              variant="default"
              radius="md"
              disabled={activeStep === 0}
              onClick={goPrevStep}
            >
              Назад
            </Button>

            {activeStep < FORM_STEPS.length - 1 ? (
              <Button
                type="button"
                radius="md"
                color="aurora"
                onClick={goNextStep}
              >
                Продолжить
              </Button>
            ) : (
              <Button
                type="submit"
                size="md"
                radius="md"
                color="dark"
                loading={isPending}
                disabled={!canSubmit}
              >
                Создать ресторан
              </Button>
            )}
          </Group>
        </Stack>
      </Paper>
    </form>
  )
}
