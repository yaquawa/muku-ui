import App from './App.vue'
import { createApp } from 'vue'
import { install, InstallOptions } from '../src'

const app = createApp(App)

const options: Partial<InstallOptions> = {
  barStyle: {
    backgroundColor: '#607D8B',
  },
  backgroundStyle: {
    backgroundColor: '#CFD8DC',
  },
}

app.use(install, options)
app.mount('#app')
