<script setup lang="ts">
interface Props {
  testimonials: Array<Testimonial>
}
defineProps<Props>()
</script>

<template>
  <UPageColumns>
    <UPageCard
      v-for="(testimonial, index) in testimonials"
      :key="index"
      variant="subtle"
      :description="testimonial.quote"
      :ui="{ description: 'before:content-[open-quote] after:content-[close-quote]' }"
    >
      <template #footer>
        <div class="space-y-2">
          <UUser
            :name="testimonial.author.name"
            :description="testimonial.author.description"
            :avatar="testimonial.author.avatar ? {
              src: `/images/${testimonial.author.avatar.src}`,
              alt: testimonial.author.name,
              provider: 'customCloudflare',
            } : undefined"
            size="xl"
          />
          <div
            v-if="testimonial.source"
            class="flex justify-end"
          >
            <span
              v-if="testimonial.source.url"
              class="text-xs text-gray-500"
            >via <NuxtLink
              class="underline"
              :to="testimonial.source.url"
              external
            >{{ testimonial.source.name }}</NuxtLink></span>
            <span
              v-else-if="testimonial.source.name"
              class="text-xs text-gray-500"
            >via {{ testimonial.source.name }}</span>
          </div>
        </div>
      </template>
    </UPageCard>
  </UPageColumns>
</template>
