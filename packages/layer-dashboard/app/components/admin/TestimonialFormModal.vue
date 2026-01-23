<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { Testimonial } from 'layer-auth/shared/types/db'
import { z } from 'zod'

interface Props {
  testimonial?: null | Testimonial
}
const props = defineProps<Props>()

const open = defineModel({ default: false, type: Boolean })

const isLoading = ref(false)
const showPreview = ref(false)

const { t } = useI18n()
const { showErrorToast, showSuccessToast } = useAppToast()
const logger = useLogger()

const schema = z.object({
  author: z.object({
    avatar: z.object({
      loading: z.literal('lazy'),
      src: z.string(),
    }).optional(),
    description: z.string().optional(),
    name: z.string().min(1),
  }),
  quote: z.string().min(1),
  source: z.object({
    name: z.string().min(1).optional(),
    url: z.string().optional(),
  }).optional(),
})
type Schema = z.output<typeof schema>

const state = reactive({
  author: {
    avatar: props.testimonial?.author.avatar?.src
      ? {
          loading: 'lazy' as const,
          src: props.testimonial.author.avatar.src,
        }
      : undefined,
    description: props.testimonial?.author.description || undefined,
    name: props.testimonial?.author.name || '',
  },
  quote: props.testimonial?.quote || '',
  source: {
    name: props.testimonial?.source?.name || '',
    url: props.testimonial?.source?.url || undefined,
  },
})

// Reset form when testimonial prop changes
watch(() => props.testimonial, (newTestimonial) => {
  if (newTestimonial) {
    state.author.name = newTestimonial.author.name
    state.author.description = newTestimonial.author.description || undefined
    state.author.avatar = newTestimonial.author.avatar?.src
      ? {
          loading: 'lazy' as const,
          src: newTestimonial.author.avatar.src,
        }
      : undefined
    state.quote = newTestimonial.quote
    state.source = {
      name: newTestimonial.source?.name || '',
      url: newTestimonial.source?.url || undefined,
    }
  }
  else {
    state.author.name = ''
    state.author.description = undefined
    state.author.avatar = undefined
    state.quote = ''
    state.source = { name: '', url: undefined }
  }
})

function onAvatarUpload (fileId: string) {
  state.author.avatar = {
    loading: 'lazy' as const,
    src: fileId,
  }
}

const previewTestimonial = computed(() => ({
  author: {
    avatar: state.author.avatar,
    description: state.author.description,
    name: state.author.name,
  },
  createdAt: new Date().toISOString(),
  id: 'preview',
  quote: state.quote,
  source: state.source,
  updatedAt: new Date().toISOString(),
}))

async function onSubmit (_event: FormSubmitEvent<Schema>) {
  isLoading.value = true

  try {
    const payload = {
      author: {
        avatar: state.author.avatar,
        description: state.author.description || undefined,
        name: state.author.name,
      },
      quote: state.quote,
      source: state.source?.name ? state.source : undefined,
    }

    if (props.testimonial) {
      await $fetch(`/api/dashboard/admin/testimonials/${props.testimonial.id}`, {
        body: payload,
        method: 'PATCH',
      })
      showSuccessToast({ title: t('pages.admin.testimonials.toast.updateSuccess') })
    }
    else {
      await $fetch('/api/dashboard/admin/testimonials', {
        body: payload,
        method: 'POST',
      })
      showSuccessToast({ title: t('pages.admin.testimonials.toast.addedSuccess') })
    }

    open.value = false
  }
  catch (error: any) {
    logger.error('Failed to save testimonial', error)
    showErrorToast(
      props.testimonial
        ? t('pages.admin.testimonials.toast.updateError')
        : t('pages.admin.testimonials.toast.addedError'),
      error,
    )
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="testimonial ? t('pages.admin.testimonials.modal.titleEdit') : t('pages.admin.testimonials.modal.titleAdd')"
  >
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit"
      >
        <div class="space-y-4">
          <UFormField
            :label="t('pages.admin.testimonials.modal.form.authorAvatarUrl.label')"
            name="author.avatar.src"
          >
            <DashboardAvatarUploader
              :image-path-name="state.author.avatar?.src"
              @upload="onAvatarUpload"
            />
          </UFormField>

          <UFormField
            :label="t('pages.admin.testimonials.modal.form.authorName.label')"
            name="author.name"
            required
          >
            <UInput v-model="state.author.name" />
          </UFormField>

          <UFormField
            :label="t('pages.admin.testimonials.modal.form.authorDescription.label')"
            name="author.description"
          >
            <UInput v-model="state.author.description" />
          </UFormField>

          <UFormField
            :label="t('pages.admin.testimonials.modal.form.quote.label')"
            name="quote"
            required
          >
            <UTextarea
              v-model="state.quote"
              :rows="4"
            />
          </UFormField>

          <UFormField
            :label="t('pages.admin.testimonials.modal.form.sourceName.label')"
            name="source.name"
          >
            <UInput v-model="state.source.name" />
          </UFormField>

          <UFormField
            :label="t('pages.admin.testimonials.modal.form.sourceUrl.label')"
            name="source.url"
          >
            <UInput v-model="state.source.url" />
          </UFormField>

          <div class="flex gap-2">
            <UButton
              type="submit"
              :loading="isLoading"
              :disabled="isLoading"
            >
              {{ testimonial ? t('pages.admin.testimonials.modal.form.submitButtonEdit') : t('pages.admin.testimonials.modal.form.submitButtonAdd') }}
            </UButton>
            <UButton
              variant="soft"
              color="neutral"
              :disabled="!state.author.name || !state.quote"
              @click="showPreview = true"
            >
              Preview
            </UButton>
          </div>
        </div>
      </UForm>
    </template>
  </UModal>

  <!-- Preview Modal -->
  <UModal
    v-model:open="showPreview"
    title="Testimonial Preview"
  >
    <template #body>
      <div class="p-4">
        <UPageCard
          :description="previewTestimonial.quote"
          :ui="{ description: 'before:content-[open-quote] after:content-[close-quote]' }"
        >
          <template #footer>
            <UUser
              :name="previewTestimonial.author.name"
              :description="previewTestimonial.author.description"
              :avatar="previewTestimonial.author.avatar"
            />
            <div
              v-if="previewTestimonial.source"
              class="mt-2"
            >
              <NuxtLink
                v-if="previewTestimonial.source.url"
                :to="previewTestimonial.source.url"
                target="_blank"
                class="text-sm text-primary hover:underline"
              >
                {{ previewTestimonial.source.name }}
              </NuxtLink>
              <span
                v-else
                class="text-sm text-gray-500"
              >
                {{ previewTestimonial.source.name }}
              </span>
            </div>
          </template>
        </UPageCard>
      </div>
    </template>
  </UModal>
</template>
