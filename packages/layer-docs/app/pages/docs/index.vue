<script setup lang="ts">
const { data: docs } = await useAsyncData('allDocs', () => queryCollection('docs').all())

if (docs.value) {
  prerenderRoutes(docs.value.map(docs => docs.path))
}

definePageMeta({
  auth: false,
  layout: 'docs',
  middleware: [
    function () {
      if (import.meta.client) {
        return navigateTo('/docs/getting-started')
      }
    },
  ],
})
</script>
