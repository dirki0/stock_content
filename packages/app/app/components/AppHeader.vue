<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { siteConfig } from 'site-config'

const navigation = inject<Ref<Array<ContentNavigationItem>>>('navigationDocs')

const { t } = useI18n()
// const { loggedIn } = useUserSession()
const route = useRoute()

// const isDashboardRoute = computed(() => route.path.startsWith('/dashboard'))

const links = computed(() => ([
  {
    icon: 'i-lucide-book',
    label: t('general.links.docs'),
    to: '/docs',
  },
  {
    icon: 'i-lucide-shield-question',
    label: t('general.links.faq'),
    to: '/faq',
  },
  {
    icon: 'i-lucide-speech',
    label: t('general.links.testimonials'),
    to: '/testimonials',
  },
  {
    icon: 'i-lucide-credit-card',
    label: t('general.links.pricing'),
    to: '/pricing',
  },
  {
    icon: 'i-lucide-newspaper',
    label: t('general.links.blog'),
    to: '/blog',
  },
  {
    icon: 'i-lucide-clock-fading',
    label: t('general.links.changelog'),
    to: '/changelog',
  },
  {
    icon: 'i-lucide-mail',
    label: t('general.links.contact'),
    to: '/contact',
  },
]))
const items = computed(() => links.value.map(({ icon, ...link }) => link))
</script>

<template>
  <UHeader :title="siteConfig.name">
    <template #title>
      <!-- If you use an svg as Logo, you can remove the ClientOnly wrapper -->
      <ClientOnly>
        <AppLogo />
        <template #fallback>
          <span>{{ $t('general.name') }}</span>
        </template>
      </ClientOnly>
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
    />

    <template #right>
      <UTooltip
        text="Search"
        :kbds="['meta', 'K']"
      >
        <UContentSearchButton />
      </UTooltip>
      <UColorModeButton />
      <!--      <AuthState> -->
      <!--        <UButton -->
      <!--          v-if="loggedIn && !isDashboardRoute" -->
      <!--          to="/dashboard" -->
      <!--          class="hidden lg:flex" -->
      <!--        > -->
      <!--          {{ t('general.dashboard') }} -->
      <!--        </UButton> -->
      <!--        <template v-if="!loggedIn"> -->
      <!--          <UButton -->
      <!--            to="/auth/login" -->
      <!--            color="neutral" -->
      <!--            variant="ghost" -->
      <!--            class="hidden lg:flex" -->
      <!--          > -->
      <!--            {{ $t('general.login') }} -->
      <!--          </UButton> -->
      <!--          <UButton -->
      <!--            to="/auth/register" -->
      <!--            class="hidden lg:flex" -->
      <!--          > -->
      <!--            {{ $t('general.register') }} -->
      <!--          </UButton> -->
      <!--        </template> -->
      <!--      </AuthState> -->
    </template>

    <template #body>
      <UNavigationMenu
        orientation="vertical"
        :items="links"
        class="-mx-2.5"
      />
      <USeparator
        type="dashed"
        class="mt-4 mb-6"
      />
      <div class="flex flex-col space-y-4">
        <!--        <AuthState> -->
        <!--          <UButton -->
        <!--            v-if="loggedIn && !isDashboardRoute" -->
        <!--            to="/dashboard" -->
        <!--          > -->
        <!--            {{ t('general.dashboard') }} -->
        <!--          </UButton> -->
        <!--          <template v-if="!loggedIn"> -->
        <!--            <UButton -->
        <!--              to="/auth/login" -->
        <!--              color="neutral" -->
        <!--              variant="ghost" -->
        <!--            > -->
        <!--              {{ $t('general.login') }} -->
        <!--            </UButton> -->
        <!--            <UButton to="/auth/register"> -->
        <!--              {{ $t('general.register') }} -->
        <!--            </UButton> -->
        <!--          </template> -->
        <!--        </AuthState> -->
      </div>
      <UContentNavigation
        highlight
        :navigation="navigation"
        class="mt-4"
      />
    </template>
  </UHeader>
</template>
