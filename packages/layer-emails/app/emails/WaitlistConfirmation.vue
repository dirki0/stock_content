<script setup lang="ts">
import { siteConfig } from 'site-config'

import EmailPrimaryButton from './components/PrimaryButton.vue'
import EmailWrapper from './components/Wrapper.vue'

interface Props {
  emailVerificationUrl: string
}
defineProps<Props>()

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
  <div>
    <EmailWrapper>
      <EHeading>Waitlist Confirmation</EHeading>
      <EHr />
      <EText :style="styles.text">
        Hey,
      </EText>
      <EText :style="styles.text">
        you requested to join the waitlist at {{ siteConfig.name }}.
      </EText>
      <EText :style="styles.text">
        You can confirm your request in by clicking the button below:
      </EText>
      <EmailPrimaryButton :href="emailVerificationUrl">
        Click to join the waitlist
      </EmailPrimaryButton>
      <EText :style="styles.note">
        If you didn't try to subscribe, you can safely ignore this email.
      </EText>
    </EmailWrapper>
  </div>
</template>
