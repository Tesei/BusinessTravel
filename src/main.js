console.log('%cБилд собран:', 'background: pink; font-size: 12px', import.meta.env.VITE_BUILD_DATE)
console.log('%cVite работает в режиме (mode):', 'background: pink; font-size: 12px', import.meta.env.MODE)
console.log('%cVITE_TEST_ENV_VAR:', 'background: pink; font-size: 12px', import.meta.env.VITE_TEST_ENV_VAR)

import { createApp } from 'vue'

import router from './router'
import store from '@/store'
import App from './App.vue'
import VueCookies from 'vue-cookies'
import vClickOutside from 'click-outside-vue3'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(VueCookies)
app.use(vClickOutside)
app.mount('#app')
