<script setup lang="ts">
import { siteConfig } from 'site-config'
</script>

<template>
  <nuxt-img
    src="/logo.png"
    preload
    :alt="`${siteConfig.name} Logo`"
  />
</template>
