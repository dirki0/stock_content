<script lang="ts" setup>
interface Props {
  accept?: string
  apiUrl: string
  imagePathName?: string
}
const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
})

const emit = defineEmits<Emits>()
interface Emits {
  upload: [string]
}

const value = ref(null)
const uploadedImagePathName = ref<null | string>(null)

// const upload = useUpload(props.apiUrl, { method: 'PUT' })
const logger = useLogger()
const { t } = useI18n()
const { showErrorToast } = useAppToast()

const imageSrc = computed(() => {
  if (uploadedImagePathName.value && uploadedImagePathName.value.startsWith('http')) {
    return uploadedImagePathName.value
  }

  return uploadedImagePathName.value ? uploadedImagePathName.value : ''
})

watch(() => props.imagePathName, (newImagePathName) => {
  if (newImagePathName) {
    uploadedImagePathName.value = newImagePathName
  }
}, { immediate: true })
</script>

<template>
  <UFileUpload
    v-slot="{ open }"
    v-model="value"
    variant="button"
    accept="image/*"
  >
    <UAvatar
      size="xl"
      src="/test-avatar.png"
      icon="i-lucide-image"
      @click="open"
    />
  </UFileUpload>
</template>
