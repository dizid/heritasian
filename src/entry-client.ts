import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import App from './App.vue'
import { createClientRouter } from './router'
import './assets/main.css'

const app = createApp(App)
const head = createHead()
const router = createClientRouter()
app.use(head)
app.use(router)

// Wait for router to be ready before mounting — ensures async components are loaded
// and hydration matches the server-rendered HTML
router.isReady().then(() => {
  app.mount('#app')
})
