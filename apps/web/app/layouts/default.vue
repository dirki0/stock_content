<template>
  <div>
    <AppBanners />

    <AppHeader />

    <UMain>
      <UContainer>
        <slot />
      </UContainer>
    </UMain>

    <AppFooter />
  </div>
</template>
