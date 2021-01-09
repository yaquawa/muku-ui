import App from './App.vue'
import { createApp } from 'vue'
import { install, InstallOptions } from '../src'

const app = createApp(App)

const options: Partial<InstallOptions> = {}

app.use(install, options)
app.mount('#app')
