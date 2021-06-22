import { App } from 'vue'
import { api } from './Api'
import { InstallOptions } from './types'
import InView from './components/InView.vue'

export function install(app: App, options: Partial<InstallOptions> = {}) {
  const configs = api.config.set(options)

  if (configs.get('registerComponent')) {
    app.component('in-view', InView)
  }

  app.config.globalProperties.$mukuInView = api
}
