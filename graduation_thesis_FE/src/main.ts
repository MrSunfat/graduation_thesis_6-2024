import './assets/main.css';
import 'vuetify/styles';
import '@vuepic/vue-datepicker/dist/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import globalPlugins from './plugins';

const app = createApp(App);

/* Setup libs for app */
globalPlugins(app);
app.mixin({
    methods: {
        formatCurrency: (money: number) =>
            money?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
            }),
        formatDate: (date: Date) => new Date(date).toLocaleString('vi-VN'),
    },
});

app.mount('#app');
