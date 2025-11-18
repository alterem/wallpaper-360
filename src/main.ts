import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import './assets/css/main.css'
import 'vue-sonner/style.css'

import vLazy from "@/directives/imglazy"

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.directive("lazy", vLazy)
app.mount('#app')
