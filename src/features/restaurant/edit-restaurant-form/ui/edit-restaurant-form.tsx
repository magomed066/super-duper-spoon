import { useEffect, useMemo, useState } from 'react'
import { useForm } from '@mantine/form'
import { Button, Group, Paper, Stack } from '@mantine/core'
import {
  updateRestaurantSchema,
  useDeleteRestaurantMutation,
  useUpdateRestaurantMutation,
  validateUpdateRestaurantForm,
  type CreateRestaurantFormValues,
  type UpdateRestaurantFormValues
} from '@/entities/restaurant'
import type { Restaurant } from '@/shared/api/services/restaurant/types'
import { BasicInfoStep } from '@/features/restaurant/create-restaurant-form/ui/components/basic-info-step'
import {
  BASIC_STEP_FIELDS,
  DELIVERY_STEP_FIELDS,
  FORM_STEPS,
  WEEK_DAYS
} from '@/features/restaurant/create-restaurant-form/ui/components/constants'
import { DeliveryScheduleStep } from '@/features/restaurant/create-restaurant-form/ui/components/delivery-schedule-step'
import { FormStepHeader } from '@/features/restaurant/create-restaurant-form/ui/components/form-step-header'
import { MediaStep } from '@/features/restaurant/create-restaurant-form/ui/components/media-step'
import ConfirmModal from '@/shared/ui/confirm-modal'
import { useNavigate } from 'react-router'

type EditRestaurantFormProps = {
  restaurant: Restaurant
}

const getInitialValues = (
  restaurant: Restaurant
): CreateRestaurantFormValues => ({
  name: restaurant.name,
  logo: restaurant.logo ?? '',
  preview: restaurant.preview ?? '',
  phone: restaurant.phone ?? restaurant.phones[0] ?? '',
  address: restaurant.address ?? '',
  description: restaurant.description ?? '',
  email: restaurant.email ?? '',
  city: restaurant.city ?? '',
  deliveryTime: String(restaurant.deliveryTime ?? 0),
  deliveryConditions: restaurant.deliveryConditions ?? '',
  cuisine: restaurant.cuisine.join(', '),
  workSchedule: WEEK_DAYS.map(({ day }) => {
    const workDay = restaurant.workSchedule.find((item) => item.day === day)

    return {
      day,
      enabled: Boolean(workDay),
      open: workDay?.open ?? '09:00',
      close: workDay?.close ?? '22:00'
    }
  })
})

export function EditRestaurantForm({ restaurant }: EditRestaurantFormProps) {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{
    logoFile?: File
    previewFile?: File
  }>({})
  const initialValues = useMemo(
    () => getInitialValues(restaurant),
    [restaurant]
  )
  const form = useForm<UpdateRestaurantFormValues>({
    initialValues,
    validate: validateUpdateRestaurantForm,
    validateInputOnBlur: true
  })
  const deleteMutation = useDeleteRestaurantMutation()
  const { mutate, isPending } = useUpdateRestaurantMutation(
    restaurant.id,
    () => {
      form.resetDirty()
    }
  )

  const canSubmit = updateRestaurantSchema.safeParse(form.values).success

  useEffect(() => {
    form.setValues(initialValues)
    form.resetDirty(initialValues)
  }, [initialValues])

  const handleUpload = (file: File, uploadType?: 'logo' | 'preview') => {
    if (!uploadType) {
      return
    }

    form.setFieldValue(uploadType, URL.createObjectURL(file))

    if (uploadType === 'logo') {
      setUploadedFiles((current) => ({
        ...current,
        logoFile: file
      }))
      return
    }

    setUploadedFiles((current) => ({
      ...current,
      previewFile: file
    }))
  }

  const handleSubmit = (data: UpdateRestaurantFormValues) => {
    mutate({
      name: data.name.trim(),
      phone: data.phone.trim(),
      address: data.address.trim(),
      description: data.description.trim(),
      email: data.email.trim() || undefined,
      city: data.city.trim() || undefined,
      logo: data.logo?.trim() || undefined,
      preview: data.preview?.trim() || undefined,
      logoFile: uploadedFiles.logoFile,
      previewFile: uploadedFiles.previewFile,
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

  const handleDelete = () => {
    deleteMutation.mutate(restaurant.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false)
        navigate('/restaurants')
      }
    })
  }

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper
          radius="24px"
          p="xl"
          className="border border-black/8 bg-white shadow-[0_18px_60px_rgba(16,19,31,0.08)]"
        >
          <Stack gap="xl">
            <Stack gap="md">
              <FormStepHeader activeStep={activeStep} />

              <Group justify="flex-end">
                <Button
                  type="button"
                  variant="light"
                  color="coral"
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={isPending || deleteMutation.isPending}
                >
                  Удалить ресторан
                </Button>

                <Button
                  type="submit"
                  radius="md"
                  color="aurora"
                  loading={isPending}
                  disabled={
                    !canSubmit || !form.isDirty() || deleteMutation.isPending
                  }
                >
                  Сохранить изменения
                </Button>
              </Group>
            </Stack>

            {activeStep === 0 && <BasicInfoStep required form={form} />}
            {activeStep === 1 && <DeliveryScheduleStep required form={form} />}
            {activeStep === 2 && (
              <MediaStep
                required
                defaultLogo={form.values.logo ?? ''}
                defaultPreview={form.values.preview ?? ''}
                isPending={isPending}
                allowUpload
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
                  key="next-step"
                  type="button"
                  radius="md"
                  color="aurora"
                  onClick={goNextStep}
                >
                  Продолжить
                </Button>
              ) : (
                <Button
                  key="submit-form"
                  type="submit"
                  size="md"
                  radius="md"
                  color="aurora"
                  loading={isPending}
                  disabled={!canSubmit}
                >
                  Сохранить изменения
                </Button>
              )}
            </Group>
          </Stack>
        </Paper>
      </form>

      <ConfirmModal
        opened={isDeleteModalOpen}
        title="Удалить ресторан?"
        description={`Ресторан «${restaurant.name}» будет удален без возможности восстановления.`}
        confirmLabel="Удалить"
        cancelLabel="Назад"
        confirmColor="coral"
        loading={deleteMutation.isPending}
        onClose={() => {
          if (!deleteMutation.isPending) {
            setIsDeleteModalOpen(false)
          }
        }}
        onConfirm={handleDelete}
      />
    </>
  )
}
