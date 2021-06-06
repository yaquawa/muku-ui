import { App } from 'vue'
import { api } from './Api'
import { InstallOptions } from './types'
import DropTarget from './components/DropTarget.vue'

export function install(app: App, options: Partial<InstallOptions> = {}) {
  const configs = api.config.set(options)

  if (configs.get('registerComponent')) {
    app.component('drop-target', DropTarget)
  }

  app.config.globalProperties.$mukuDropTarget = api
}
