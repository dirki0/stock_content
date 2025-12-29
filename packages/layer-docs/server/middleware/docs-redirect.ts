export default defineEventHandler((event) => {
  if (event.path === '/docs') {
    return sendRedirect(event, '/docs/getting-started')
  }
})
