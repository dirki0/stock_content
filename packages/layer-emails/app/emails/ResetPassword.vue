<script setup lang="ts">
import { siteConfig } from 'site-config'

import EmailPrimaryButton from './components/PrimaryButton.vue'
import EmailWrapper from './components/Wrapper.vue'

interface Props {
  name?: string
  url: string
}
const props = defineProps<Props>()

const styles = {
  note: {
    color: 'rgb(107,114,128)',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
  text: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
  },
}
</script>

<template>
  <EmailWrapper>
    <EHeading>Reset your password</EHeading>
    <EHr />
    <EText :style="styles.text">
      Hey{{ props.name ? ` ${props.name}` : '' }},
    </EText>
    <EText :style="styles.text">
      you requested a password request from {{ siteConfig.name }}.
    </EText>
    <EText :style="styles.text">
      You can reset your password by clicking the button below:
    </EText>
    <EmailPrimaryButton :href="url">
      Reset password
    </EmailPrimaryButton>
    <EText :style="styles.note">
      If you didn't try to reset your password, you can safely ignore this email.
    </EText>
  </EmailWrapper>
</template>
