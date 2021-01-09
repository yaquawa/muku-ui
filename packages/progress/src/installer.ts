import { App } from 'vue'
import { api } from './Api'
import { InstallOptions } from './types'
import ProgressLinear from './components/ProgressLinear.vue'

export function install(app: App, options: Partial<InstallOptions> = {}) {
  const configs = api.config.set(options)

  if (configs.get('registerComponent')) {
    app.component('progress-linear', ProgressLinear)
  }

  app.config.globalProperties.$mukuProgress = api
}
