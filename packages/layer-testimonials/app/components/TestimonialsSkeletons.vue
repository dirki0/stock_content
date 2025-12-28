<template>
  <UPageColumns>
    <UPageCard
      v-for="n of 9"
      :key="n"
      variant="subtle"
    >
      <USkeleton class="w-full h-60" />
    </UPageCard>
  </UPageColumns>
</template>
