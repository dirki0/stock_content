<script lang="ts" setup>
interface Props {
  description?: string
  title: string
}
defineProps<Props>()
</script>

<template>
  <UPage>
    <UPageHeader
      :title="title"
      :description="description"
    >
      <template #description>
        <slot name="description" />
      </template>
      <template #headline>
        <slot name="headline" />
      </template>
    </UPageHeader>
    <UPageBody>
      <slot />
    </UPageBody>
  </UPage>
</template>
