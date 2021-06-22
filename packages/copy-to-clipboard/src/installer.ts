import { App } from 'vue'
import { api } from './Api'
import { InstallOptions } from './types'
import CopyToClipboard from './components/CopyToClipboard.vue'

export function install(app: App, options: Partial<InstallOptions> = {}) {
  const configs = api.config.set(options)

  if (configs.get('registerComponent')) {
    app.component('copy-to-clipboard', CopyToClipboard)
  }

  app.config.globalProperties.$mukuCopyToClipboard = api
}
