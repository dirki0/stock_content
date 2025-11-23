<script lang="ts" setup>
interface Props {
  description?: string
  title: string
}
defineProps<Props>()
</script>

<template>
  <UModal
    :title="title"
    :description="description"
    :dismissible="false"
  >
    <template #content>
      <UAlert
        :title="title"
        :description="description"
        color="neutral"
        variant="subtle"
        icon="i-lucide-rotate-cw"
        :ui="{
          icon: 'shrink-0 size-5 animate-spin',
        }"
      />
    </template>
  </UModal>
</template>
