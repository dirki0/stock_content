<script setup lang="ts">
import { siteConfig } from 'site-config'

import EmailLogo from './Logo.vue'

const styles = {
  container: {
    borderColor: 'rgb(209,213,219)',
    borderRadius: '0.5rem',
    borderStyle: 'solid',
    borderWidth: '1px',
    padding: '1rem',
  },
  footnote: {
    fontSize: '12px',
    textAlign: 'center',
  },
}
</script>

<template>
  <EHtml
    lang="en"
    dir="ltr"
  >
    <EHead>
      <EFont
        font-family="Onest"
        fallback-font-family="Arial"
        :font-weight="400"
        font-style="normal"
      />
    </EHead>

    <ESection>
      <ERow>
        <EContainer
          :style="styles.container"
        >
          <EmailLogo />
          <slot />
        </EContainer>
      </ERow>
    </ESection>

    <ESection>
      <ERow>
        <EText
          :style="[styles.footnote, { marginBottom: '0px' }]"
        >
          {{ siteConfig.name }}
        </EText>
        <EText
          :style="[styles.footnote, { marginTop: '0px' }]"
        >
          <ELink
            :href="siteConfig.url"
            class="text-primary"
            :style="[styles.footnote, { color: 'rgb(252,137,7)' }]"
          >
            {{ siteConfig.domain }}
          </ELink>
        </EText>
      </ERow>
    </ESection>
  </EHtml>
</template>
