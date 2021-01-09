import { App } from 'vue'
import { api } from './Api'
import { InstallOptions } from './types'
import Rating from './components/Rating.vue'

export function install(app: App, options: Partial<InstallOptions> = {}): void {
  const configs = api.config.set(options)

  if (configs.get('registerComponent')) {
    app.component('rating', Rating)
  }

  app.config.globalProperties.$mukuRating = api
}
