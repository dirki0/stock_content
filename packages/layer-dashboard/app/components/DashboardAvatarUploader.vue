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
const { uploadToServer } = useFileStorage()

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

async function onUpdateModelValue (file: File | null | undefined) {
  if (!file) {
    return
  }

  try {
    const uploadedFile = await uploadToServer(file)
    console.log('uploadedFile path', uploadedFile.path)
    emit('upload', uploadedFile.path)
  }
  catch (error: any) {
    showErrorToast('Upload failed', t('components.dashboardAvatarUploader.uploadErrorMessage')) // FIXME: i18n
    logger.error('Upload failed', error)
  }
}

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
    @update:model-value="onUpdateModelValue"
  >
    <UAvatar
      size="xl"
      src="/test-avatar.png"
      icon="i-lucide-image"
      @click="open"
    />
  </UFileUpload>
</template>
