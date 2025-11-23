<script setup lang="ts">
import { siteConfig } from 'site-config'

const styles = {
  image: {
    marginBottom: '0px',
    marginTop: '0px',
  },
  logo: {
    marginTop: '1rem',
  },
}
</script>

<template>
  <ESection :style="styles.logo">
    <EImg
      width="100"
      :src="siteConfig.logoWithTextUrl"
      :style="styles.image"
    />
  </ESection>
</template>
