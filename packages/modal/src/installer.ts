import { api as modalApi } from './Api'
import { App } from 'vue'
import { InstallOptions } from './types'
import Modal from './components/Modal.vue'
import { isServer } from '@muku-ui/shared'
import { createBackdrop } from './Backdrop'

export function install(app: App, options: Partial<InstallOptions> = {}) {
  const configs = modalApi.config.set(options)

  if (!isServer()) {
    createBackdrop()
  }

  if (configs.get('registerComponent')) {
    app.component('modal', Modal)
  }

  app.config.globalProperties.$mukuModal = modalApi
}
