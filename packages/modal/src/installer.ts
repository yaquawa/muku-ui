import { api as modalApi } from './Api';
import { App, createApp } from 'vue';
import { InstallOptions } from './types';
import Modal from './components/Modal.vue';
import Backdrop from './components/Backdrop.vue';

function createBackdrop() {
  const mountPoint = document.createElement('div');
  document.body.appendChild(createApp(Backdrop).mount(mountPoint).$el);
}

export function install(app: App, options: Partial<InstallOptions> = {}) {
  const configs = modalApi.setConfig(options);

  createBackdrop();

  if (configs.registerComponent) {
    app.component('modal', Modal);
  }

  app.config.globalProperties.$modal = modalApi;
}
