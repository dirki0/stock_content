<script setup lang="ts">
import { de, en } from '@nuxt/ui/locale'
import { siteConfig } from 'site-config'

const { locale, setLocale, t } = useI18n()
const localePath = useLocalePath()

const footerColumns = [{
  children: [{
    label: 'Nuxters',
    target: '_blank',
    to: 'https://nuxters.nuxt.com',
  }, {
    label: 'Video Courses',
    target: '_blank',
    to: 'https://masteringnuxt.com/nuxt3?ref=nuxt',
  }, {
    label: 'Nuxt on GitHub',
    target: '_blank',
    to: 'https://github.com/nuxt',
  }],
  label: 'Community',
}, {
  children: [{
    label: 'Nuxt Content',
    target: '_blank',
    to: 'https://content.nuxt.com/',
  }, {
    label: 'Nuxt DevTools',
    target: '_blank',
    to: 'https://devtools.nuxt.com/',
  }, {
    label: 'Nuxt Image',
    target: '_blank',
    to: 'https://image.nuxt.com/',
  }, {
    label: 'Nuxt UI',
    target: '_blank',
    to: 'https://ui.nuxt.com/',
  }],
  label: 'Solutions',
}]

const items = [
  {
    label: t('general.links.legal.terms'),
    slot: 'localeLink',
    target: '_blank',
    to: localePath('legal-terms'),
  },
  {
    label: t('general.links.legal.privacy'),
    slot: 'localeLink',
    target: '_blank',
    to: localePath('legal-privacy'),
  },
]

async function onUpdateLocale (newLocale?: 'de' | 'en') {
  if (newLocale) {
    await setLocale(newLocale)
  }
}
</script>

<template>
  <USeparator
    class="h-px"
  >
    <Logo class="h-14 w-full object-contain" />
  </USeparator>

  <UFooter :ui="{ top: 'border-b border-(--ui-border)' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="footerColumns">
          <template #right>
            <div class="flex flex-col items-center gap-2">
              <span class="text-gray-400">{{ $t('pages.home.waitlistSection.description') }}</span>
              <WaitlistForm />
            </div>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <ULink
        to="https://github.com/nuxt/ui"
        target="_blank"
        class="text-sm text-[var(--ui-text-muted)]"
      >
        {{ $t('general.footer.copyright', {
          year: new Date().getFullYear(),
        }) }}
      </ULink>
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
    >
      <template #localeLink="{ item }">
        <ClientOnly>
          <ULink
            :to="item.to"
            :target="item.target"
          >
            {{ item.label }}
          </ULink>
        </ClientOnly>
      </template>
    </UNavigationMenu>

    <template #right>
      <ULocaleSelect
        :model-value="locale"
        :locales="[de, en]"
        @update:model-value="onUpdateLocale"
      />
      <UButton
        :aria-label="siteConfig.socialMedia.x.ariaLabel"
        icon="i-simple-icons-x"
        :to="siteConfig.socialMedia.x.url"
        target="_blank"
        color="neutral"
        variant="ghost"
      />
      <UButton
        :aria-label="siteConfig.socialMedia.github.ariaLabel"
        icon="i-simple-icons-github"
        :to="siteConfig.socialMedia.github.url"
        target="_blank"
        color="neutral"
        variant="ghost"
      />
      <span>
        <span class="text-xs">Powered by</span>
        <ULink
          to="https://nuxtstarterkit.com"
          target="_blank"
          class="text-sm text-[var(--ui-text-muted)]"
        >
          Nuxt Starter Kit
        </ULink>
      </span>
    </template>
  </UFooter>
</template>
