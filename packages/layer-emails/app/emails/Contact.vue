<script setup lang="ts">
import EmailWrapper from './components/Wrapper.vue'

interface Props {
  email: string
  message: string
  name: string
}
defineProps<Props>()

const styles = {
  text: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
  },
}
</script>

<template>
  <EmailWrapper>
    <EHeading>Contact Form Submission</EHeading>
    <EHr />
    <EText :style="styles.text">
      Name: {{ name }}
    </EText>
    <EText :style="styles.text">
      Email: {{ email }}
    </EText>
    <EText :style="styles.text">
      Message: {{ message }}
    </EText>
  </EmailWrapper>
</template>
