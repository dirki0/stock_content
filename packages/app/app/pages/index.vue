<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const { t } = useI18n()
const { data: testimonials } = useFetch<Array<Testimonial>>('/api/testimonials', { server: false })

const heroLinks: Array<ButtonProps> = [
  {
    icon: 'i-lucide-arrow-right',
    label: t('pages.home.hero.action1Label'),
    size: 'xl',
    to: '/dashboard',
    trailing: true,
  },
]

const ctaLinks = ref<Array<ButtonProps>>([
  {
    label: t('pages.home.cta.link1Label'),
    to: '/dashboard',
    trailingIcon: 'i-lucide-arrow-right',
  },
  {
    color: 'neutral',
    label: t('pages.home.cta.link2Label'),
    to: '/docs',
    variant: 'ghost',
  },
])

interface HeroSectionFeature {
  featureCount: number
  featureIcons: Array<string>
  imagePath: string
  name: string
  reverse?: boolean
}
const features: Array<HeroSectionFeature> = [
  {
    featureCount: 3,
    featureIcons: [
      'i-lucide-rocket',
      'i-lucide-chef-hat',
      'i-lucide-earth',
    ],
    imagePath: '/images/placeholder.jpg',
    name: 'one',
  },
  {
    featureCount: 3,
    featureIcons: [
      'i-lucide-chef-hat',
      'i-lucide-rocket',
      'i-lucide-earth',
    ],
    imagePath: '/images/placeholder.jpg',
    name: 'two',
    reverse: true,
  },
]

function getFeatures (feature: HeroSectionFeature) {
  return Array.from({ length: feature.featureCount }, (_, index) => ({
    description: t(`pages.home.featureSection.${feature.name}.feature${index + 1}.description`),
    icon: feature.featureIcons[index],
    title: t(`pages.home.featureSection.${feature.name}.feature${index + 1}.title`),
  }))
}

definePageMeta({
  layout: 'landing',
})

defineOgImageComponent('OgImageTemplate')
</script>

<template>
  <div>
    <UPageHero
      :title="t('general.name')"
      :description="t('general.description')"
      :links="heroLinks"
    >
      <div class="absolute inset-0 landing-grid z-[-1] [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" />

      <template #top>
        <div class="absolute rounded-full dark:bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />

        <LazyStarsBg />
      </template>

      <template #headline>
        <UBadge
          variant="subtle"
          size="lg"
          class="relative rounded-full font-semibold"
        >
          {{ $t('pages.home.hero.headline') }}
        </UBadge>
      </template>
    </UPageHero>

    <UPageSection
      v-for="feature of features"
      :key="feature.name"
      :title="t(`pages.home.featureSection.${feature.name}.title`)"
      :description="t(`pages.home.featureSection.${feature.name}.description`)"
      orientation="horizontal"
      :reverse="feature.reverse"
      :features="getFeatures(feature)"
    >
      <nuxt-img :src="feature.imagePath" />
    </UPageSection>

    <UPageLogos
      title="Trusted by the best front-end teams"
      marquee
      :items="[
        'i-simple-icons-github',
        'i-simple-icons-discord',
        'i-simple-icons-x',
        'i-simple-icons-instagram',
        'i-simple-icons-linkedin',
        'i-simple-icons-facebook',
      ]"
    />

    <UPageSection
      :title="t('pages.home.pricingSection.title')"
      :description="t('pages.home.pricingSection.description')"
      icon="i-lucide-credit-card"
    >
      <ClientOnly>
        <PricingPlans />
        <template #fallback>
          <USkeleton class="h-[500px]" />
        </template>
      </ClientOnly>
    </UPageSection>

    <UPageSection
      :title="t('pages.home.faqSection.title')"
      :description="t('pages.home.faqSection.description')"
      icon="i-lucide-shield-question"
    >
      <FAQ />
    </UPageSection>

    <UPageSection
      :title="t('pages.home.testimonialsSection.title')"
      :description="t('pages.home.testimonialsSection.description')"
      icon="i-lucide-speech"
    >
      <ClientOnly>
        <Testimonials :testimonials="testimonials ?? []" />
        <template #fallback>
          <TestimonialsSkeletons />
        </template>
      </ClientOnly>
    </UPageSection>

    <UPageSection
      :title="t('pages.home.waitlistSection.title')"
      :description="t('pages.home.waitlistSection.description')"
      icon="i-lucide-key"
    >
      <template #links>
        <WaitlistForm />
      </template>
    </UPageSection>

    <UPageCTA
      :title="t('pages.home.cta.title')"
      :description="t('pages.home.cta.description')"
      :links="ctaLinks"
      variant="naked"
      class="overflow-hidden"
    >
      <div class="absolute rounded-full dark:bg-(--ui-primary) blur-[250px] size-40 sm:size-50 transform -translate-x-1/2 left-1/2 -translate-y-80" />
      <LazyStarsBg />
    </UPageCTA>
  </div>
</template>
