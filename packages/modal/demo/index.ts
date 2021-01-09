import App from './App.vue'
import { createApp } from 'vue'
import { install, InstallOptions } from '../src'

const app = createApp(App)

const options: Partial<InstallOptions> = {
  backdropStyle: { backgroundColor: 'rgba(0,0,0,0.8)' },
  placeCenter: true,
}

app.use(install, options)
app.mount('#app')
