import { App } from 'vue';
import { api } from './Api';
import { InstallOptions } from './types';
import Tooltip from './components/Tooltip.vue';

export function install(app: App, options: Partial<InstallOptions> = {}) {
  const configs = api.config.set(options);

  if (configs.get('registerComponent')) {
    app.component('tooltip', Tooltip);
  }

  app.config.globalProperties.$tooltip = api;
}
