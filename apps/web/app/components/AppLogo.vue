<script setup lang="ts">
interface Props {
  linkTextClass?: string
  showAppName?: boolean
}

const { linkTextClass = 'text-lg', showAppName = true } = defineProps<Props>()
</script>

<template>
  <ULink
    to="/"
    class="flex items-center gap-2 font-bold text-highlighted"
    :class="[linkTextClass]"
  >
    <Logo class="w-auto h-6 shrink-0" /> <span v-if="showAppName">{{ $t('general.name') }}</span>
  </ULink>
</template>
