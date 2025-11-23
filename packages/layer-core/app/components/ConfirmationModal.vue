<script lang="ts" setup>
interface Props {
  cancelLabel?: string
  confirmButtonColor?: 'error' | 'info' | 'neutral' | 'primary' | 'secondary' | 'success' | 'warning'
  confirmLabel?: string
  description?: string
  title: string
}
defineProps<Props>()

const emit = defineEmits<Emits>()
interface Emits {
  cancel: []
  confirm: []
}

const open = defineModel('open', { required: true, type: Boolean })

const { t } = useI18n()

function onConfirm () {
  open.value = false
  emit('confirm')
}

function onCancel () {
  open.value = false
  emit('cancel')
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="title"
    :description="description"
    :ui="{ footer: 'justify-end' }"
  >
    <template #footer>
      <UButton
        :label="cancelLabel ?? t('general.modals.confirmation.cancel')"
        color="neutral"
        variant="outline"
        @click="onCancel"
      />
      <UButton
        :label="confirmLabel ?? t('general.modals.confirmation.confirm')"
        :color="confirmButtonColor ?? 'neutral'"
        @click="onConfirm"
      />
    </template>
  </UModal>
</template>
