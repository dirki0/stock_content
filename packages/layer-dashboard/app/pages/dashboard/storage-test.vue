<script setup lang="ts">
import { formatFileSize } from 'layer-storage/shared/utils/format'

// Dev-only page
if (!import.meta.dev) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
  })
}

const { error: uploadError, uploading, uploadToServer } = useFileStorage({
  maxSize: 10 * 1024 * 1024, // 10MB
  onError: (err) => {
    useToast().add({
      color: 'error',
      description: err.message,
      title: 'Upload Failed',
    })
  },
  onSuccess: (file) => {
    useToast().add({
      color: 'success',
      description: `File "${file.originalName}" uploaded successfully`,
      title: 'Upload Success',
    })
    loadFiles()
  },
})

const files = ref<Array<any>>([])
const isLoading = ref(false)
const isDeletingId = ref<null | string>(null)
const selectedFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedImageUrl = ref<null | string>(null)
const isImageModalOpen = ref(false)

async function loadFiles () {
  isLoading.value = true
  try {
    const response = await $fetch('/api/storage/list')
    files.value = response.files || []

    // Fetch URLs for all files
    await Promise.all(files.value.map(async (file) => {
      try {
        const fileData = await $fetch<{ url: string }>(`/api/storage/${file.id}`)
        file.url = fileData.url
      }
      catch {
        // Silently fail for individual file URL fetches
      }
    }))
  }
  catch (err: any) {
    useToast().add({
      color: 'error',
      description: err.data?.message || 'Failed to load files',
      title: 'Error',
    })
  }
  finally {
    isLoading.value = false
  }
}

function handleFileSelect (event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]!
  }
}

async function uploadFile () {
  if (!selectedFile.value) {
    useToast().add({
      color: 'warning',
      description: 'Please select a file first',
      title: 'No File Selected',
    })
    return
  }

  try {
    await uploadToServer(selectedFile.value)
    selectedFile.value = null
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
  catch {
    // Error handled in onError callback
  }
}

async function deleteFile (fileId: string) {
  isDeletingId.value = fileId
  try {
    await $fetch(`/api/storage/${fileId}`, {
      method: 'DELETE',
    })
    useToast().add({
      color: 'success',
      description: 'File deleted successfully',
      title: 'Delete Success',
    })
    loadFiles()
  }
  catch (err: any) {
    useToast().add({
      color: 'error',
      description: err.data?.message || 'Failed to delete file',
      title: 'Delete Failed',
    })
  }
  finally {
    isDeletingId.value = null
  }
}

function formatDate (dateString: string) {
  return new Date(dateString).toLocaleString()
}

function getFileIcon (fileType: string) {
  switch (fileType) {
    case 'image':
      return 'i-heroicons-photo'
    case 'video':
      return 'i-heroicons-film'
    case 'audio':
      return 'i-heroicons-musical-note'
    case 'text':
      return 'i-heroicons-document-text'
    default:
      return 'i-heroicons-document'
  }
}

function viewImage (url: string) {
  selectedImageUrl.value = url
  isImageModalOpen.value = true
}

onMounted(() => {
  loadFiles()
})

definePageMeta({
  layout: 'dashboard',
})
</script>

<template>
  <UDashboardPanel id="storage-test">
    <template #header>
      <UDashboardNavbar title="Storage Test">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <!-- Upload Section -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">
              Upload File
            </h2>
          </template>

          <div class="space-y-4">
            <div>
              <input
                ref="fileInputRef"
                type="file"
                class="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary-50 file:text-primary-700
                hover:file:bg-primary-100
                dark:file:bg-primary-900 dark:file:text-primary-300
                dark:hover:file:bg-primary-800"
                @change="handleFileSelect"
              >
            </div>

            <div
              v-if="selectedFile"
              class="text-sm text-gray-600 dark:text-gray-400"
            >
              Selected: {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
            </div>

            <div
              v-if="uploadError"
              class="text-sm text-red-600"
            >
              {{ uploadError }}
            </div>

            <UButton
              :disabled="!selectedFile || uploading"
              :loading="uploading"
              @click="uploadFile"
            >
              {{ uploading ? 'Uploading...' : 'Upload File' }}
            </UButton>
          </div>
        </UCard>

        <!-- Files List Section -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">
                Your Files
              </h2>
              <UButton
                icon="i-heroicons-arrow-path"
                variant="ghost"
                :loading="isLoading"
                @click="loadFiles"
              >
                Refresh
              </UButton>
            </div>
          </template>

          <div
            v-if="isLoading"
            class="text-center py-8"
          >
            <UIcon
              name="i-heroicons-arrow-path"
              class="w-8 h-8 animate-spin"
            />
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Loading files...
            </p>
          </div>

          <div
            v-else-if="files.length === 0"
            class="text-center py-8 text-gray-500"
          >
            No files uploaded yet
          </div>

          <div
            v-else
            class="space-y-2"
          >
            <div
              v-for="file in files"
              :key="file.id"
              class="flex items-start justify-between p-4 border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div class="flex items-start space-x-4 flex-1 min-w-0">
                <!-- Image Preview or Icon -->
                <div class="shrink-0">
                  <nuxt-img
                    v-if="file.fileType === 'image' && file.url"
                    :src="file.url"
                    :alt="file.originalName"
                    width="80"
                    height="80"
                    format="webp"
                    quality="80"
                    class="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    @click="viewImage(file.url)"
                  />
                  <UIcon
                    v-else
                    :name="getFileIcon(file.fileType)"
                    class="w-8 h-8 text-primary-500"
                  />
                </div>

                <div class="flex-1 min-w-0">
                  <p class="font-medium truncate">
                    {{ file.originalName }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatFileSize(file.size) }} • {{ file.mimeType }}
                  </p>
                  <p class="text-xs text-gray-400 dark:text-gray-500">
                    Uploaded: {{ formatDate(file.createdAt) }}
                  </p>
                  <p
                    v-if="file.url"
                    class="text-xs text-blue-500 dark:text-blue-400 truncate mt-1"
                  >
                    {{ file.url }}
                  </p>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <UBadge :color="file.isActive ? 'success' : 'neutral'">
                  {{ file.isActive ? 'Active' : 'Inactive' }}
                </UBadge>

                <UButton
                  v-if="file.fileType === 'image' && file.url"
                  icon="i-heroicons-eye"
                  variant="ghost"
                  @click="viewImage(file.url)"
                >
                  View
                </UButton>

                <UButton
                  icon="i-heroicons-trash"
                  color="error"
                  variant="ghost"
                  :loading="isDeletingId === file.id"
                  @click="deleteFile(file.id)"
                >
                  Delete
                </UButton>
              </div>
            </div>
          </div>

          <template #footer>
            <p class="text-sm text-gray-500">
              Total files: {{ files.length }}
            </p>
          </template>
        </UCard>

        <!-- Debug Info -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">
              Debug Info
            </h2>
          </template>

          <div class="space-y-2 text-sm">
            <div>
              <span class="font-semibold">Upload Status:</span>
              {{ uploading ? 'Uploading...' : 'Ready' }}
            </div>
            <div>
              <span class="font-semibold">Files Count:</span>
              {{ files.length }}
            </div>
            <div v-if="uploadError">
              <span class="font-semibold text-red-600">Last Error:</span>
              {{ uploadError }}
            </div>
          </div>
        </UCard>

        <!-- Image Preview Modal -->
        <UModal v-model="isImageModalOpen">
          <template #body>
            <UCard>
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold">
                    Image Preview
                  </h3>
                  <UButton
                    icon="i-heroicons-x-mark"
                    variant="ghost"
                    @click="isImageModalOpen = false"
                  />
                </div>
              </template>

              <div class="flex justify-center">
                <nuxt-img
                  v-if="selectedImageUrl"
                  :src="selectedImageUrl"
                  alt="Preview"
                  format="webp"
                  quality="90"
                  class="max-w-full h-auto rounded-lg"
                />
              </div>
            </UCard>
          </template>
        </UModal>
      </div>
    </template>
  </UDashboardPanel>
</template>
