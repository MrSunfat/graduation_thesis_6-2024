import './assets/main.css';
import 'vuetify/styles';
import '@vuepic/vue-datepicker/dist/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import globalPlugins from './plugins';

const app = createApp(App);

/* Setup libs for app */
globalPlugins(app);

app.mount('#app');
