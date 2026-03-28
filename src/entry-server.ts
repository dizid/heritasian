import { createSSRApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createHead, renderSSRHead } from '@unhead/vue/server'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import { routes } from './router'

export async function render(url: string): Promise<{ html: string; head: Awaited<ReturnType<typeof renderSSRHead>> }> {
  const app = createSSRApp(App)

  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  const head = createHead()
  app.use(head)
  app.use(router)

  // Navigate to the target URL and wait for async components + data
  await router.push(url)
  await router.isReady()

  const html = await renderToString(app)
  const headPayload = await renderSSRHead(head)

  return { html, head: headPayload }
}
