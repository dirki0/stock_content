<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { Banner } from 'layer-auth/shared/types/db'
import { z } from 'zod'

interface Props {
  banner?: Banner | null
}
const props = defineProps<Props>()

const open = defineModel({ default: false, type: Boolean })

const isLoading = ref(false)

const { t } = useI18n()
const { showErrorToast, showSuccessToast } = useAppToast()
const logger = useLogger()

const colorOptions = [
  { label: 'Error', value: 'error' },
  { label: 'Info', value: 'info' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Success', value: 'success' },
  { label: 'Warning', value: 'warning' },
]

const targetOptions = [
  { label: 'Same Tab (_self)', value: '_self' },
  { label: 'New Tab (_blank)', value: '_blank' },
]

const schema = z.object({
  color: z.string().min(1),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
  isClosable: z.boolean().optional(),
  showUntil: z.string().optional(),
  target: z.string().optional(),
  title: z.string().min(1),
  to: z.string().optional(),
})
type Schema = z.output<typeof schema>

const state = reactive({
  color: props.banner?.color || 'primary',
  icon: props.banner?.icon || '',
  isActive: props.banner?.isActive || false,
  isClosable: props.banner?.isClosable || false,
  showUntil: props.banner?.showUntil ? new Date(props.banner.showUntil).toISOString().split('T')[0] : '',
  target: props.banner?.target || '_self',
  title: props.banner?.title || '',
  to: props.banner?.to || '',
})

// Reset form when banner prop changes
watch(() => props.banner, (newBanner) => {
  if (newBanner) {
    state.title = newBanner.title
    state.color = newBanner.color
    state.icon = newBanner.icon || ''
    state.to = newBanner.to || ''
    state.target = newBanner.target || '_self'
    state.isClosable = newBanner.isClosable
    state.isActive = newBanner.isActive
    state.showUntil = newBanner.showUntil ? new Date(newBanner.showUntil).toISOString().split('T')[0] : ''
  }
  else {
    state.title = ''
    state.color = 'primary'
    state.icon = ''
    state.to = ''
    state.target = '_self'
    state.isClosable = false
    state.isActive = false
    state.showUntil = ''
  }
})

async function onSubmit (_event: FormSubmitEvent<Schema>) {
  isLoading.value = true

  try {
    const payload = {
      color: state.color,
      icon: state.icon || undefined,
      isActive: state.isActive,
      isClosable: state.isClosable,
      showUntil: state.showUntil ? new Date(state.showUntil).toISOString() : undefined,
      target: state.target || undefined,
      title: state.title,
      to: state.to || undefined,
    }

    if (props.banner) {
      await $fetch(`/api/dashboard/admin/banner/${props.banner.id}`, {
        body: payload,
        method: 'PATCH',
      })
      showSuccessToast({ title: 'Banner updated' })
    }
    else {
      await $fetch('/api/dashboard/admin/banner', {
        body: payload,
        method: 'POST',
      })
      showSuccessToast({ title: 'Banner created' })
    }

    open.value = false
  }
  catch (error: any) {
    logger.error('Failed to save banner', error)
    showErrorToast(
      props.banner ? t('pages.admin.banner.updateError') : 'Failed to create banner',
      error,
    )
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="banner ? t('pages.admin.banner.modal.titleEdit') : t('pages.admin.banner.modal.titleAdd')"
  >
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit"
      >
        <div class="space-y-4">
          <UFormField
            :label="t('pages.admin.banner.modal.form.title.label')"
            name="title"
            required
          >
            <UInput v-model="state.title" />
          </UFormField>

          <UFormField
            :label="t('pages.admin.banner.modal.form.color.label')"
            name="color"
            required
          >
            <USelect
              v-model="state.color"
              :items="colorOptions"
            />
          </UFormField>

          <UFormField
            :label="t('pages.admin.banner.modal.form.icon.label')"
            name="icon"
          >
            <UInput
              v-model="state.icon"
              placeholder="e.g., i-lucide-info"
            />
          </UFormField>

          <UFormField
            :label="t('pages.admin.banner.modal.form.link.label')"
            name="to"
          >
            <UInput v-model="state.to" />
          </UFormField>

          <UFormField
            :label="t('pages.admin.banner.modal.form.linkTarget.label')"
            name="target"
          >
            <USelect
              v-model="state.target"
              :items="targetOptions"
            />
          </UFormField>

          <UFormField
            :label="t('pages.admin.banner.modal.form.closable.label')"
            name="isClosable"
          >
            <USwitch v-model="state.isClosable" />
          </UFormField>

          <UFormField
            :label="t('pages.admin.banner.modal.form.showUntilDate.label')"
            :description="t('pages.admin.banner.modal.form.showUntilDate.description')"
            name="showUntil"
          >
            <UInput
              v-model="state.showUntil"
              type="date"
            />
          </UFormField>

          <div class="flex gap-2">
            <UButton
              type="submit"
              :loading="isLoading"
              :disabled="isLoading"
            >
              {{ banner ? t('pages.admin.banner.modal.form.submitButtonEdit') : t('pages.admin.banner.modal.form.submitButtonAdd') }}
            </UButton>
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
