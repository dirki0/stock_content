<script lang="ts" setup>
interface Props {
  accept?: string
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
const uploadedImageUrl = ref<null | string>(null)
const { uploadToServer } = useFileStorage({
  onError: (err) => {
    useToast().add({
      color: 'error',
      description: err.message,
      title: 'Upload Failed',
    })
  },
  onSuccess: async (file) => {
    useToast().add({
      color: 'success',
      description: `File "${file.originalName}" uploaded successfully`,
      title: 'Upload Success',
    })
    // Fetch the URL for the uploaded file
    try {
      const fileData = await $fetch<{ url: string }>(`/api/storage/${file.id}`)
      uploadedImageUrl.value = fileData.url
      emit('upload', file.id)
    }
    catch (error) {
      console.error('Failed to fetch uploaded file URL', error)
    }
  },
})

const imageSrc = computed(() => {
  return uploadedImageUrl.value || ''
})

async function onUpdateModelValue (file: File | null | undefined) {
  if (!file) {
    return
  }

  try {
    await uploadToServer(file)
  }
  catch (error: any) {
    console.error('Upload failed', error)
  }
}

// Load existing image URL if imagePathName is provided
watch(
  () => props.imagePathName,
  async (newImagePathName) => {
    if (newImagePathName) {
      // If it's already a URL, use it directly
      if (newImagePathName.startsWith('http')) {
        uploadedImageUrl.value = newImagePathName
      }
      else {
        // Otherwise, fetch the URL from the API
        try {
          const fileData = await $fetch<{ url: string }>(
            `/api/storage/${newImagePathName}`,
          )
          uploadedImageUrl.value = fileData.url
        }
        catch (error) {
          console.error('Failed to load image URL', error)
        }
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <UFileUpload
    v-slot="{ open }"
    v-model="value"
    variant="button"
    :accept="accept"
    @update:model-value="onUpdateModelValue"
  >
    <UAvatar
      size="xl"
      :src="imageSrc"
      icon="i-lucide-image"
      @click="open"
    />
  </UFileUpload>
</template>
