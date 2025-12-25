<script setup lang="ts">
import { siteConfig } from 'site-config'

import EmailPrimaryButton from './components/PrimaryButton.vue'
import EmailWrapper from './components/Wrapper.vue'

interface Props {
  emailVerificationUrl: string
  name?: string
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
    <EHeading>Login</EHeading>
    <EHr />
    <EText :style="styles.text">
      Hey{{ props.name ? ` ${props.name}` : '' }},
    </EText>
    <EText :style="styles.text">
      you requested a login email from {{ siteConfig.name }}.
    </EText>
    <EText :style="styles.text">
      You can log in by clicking the button below:
    </EText>
    <EmailPrimaryButton :href="emailVerificationUrl">
      Click to log in
    </EmailPrimaryButton>
    <EText :style="styles.note">
      If you didn't try to login, you can safely ignore this email.
    </EText>
  </EmailWrapper>
</template>
