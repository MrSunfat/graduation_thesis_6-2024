import { createPinia } from 'pinia';
import router from '@/router';
import type { App } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const globalConfigs = (app: App<Element>) => {
    const vuetify = createVuetify({
        components,
        directives,
    });
    // app.component('Button', Button);
    app.use(createPinia());
    app.use(router);
    app.use(vuetify);
};

export default globalConfigs;
