import App from './App.vue';
import { createApp } from 'vue';
import { install, InstallOptions } from '../src';

const app = createApp(App);

app.use(install);
app.mount('#app');
