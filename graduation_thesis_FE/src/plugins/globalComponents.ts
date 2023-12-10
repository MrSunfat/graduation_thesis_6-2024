import type { App } from 'vue';
import Toast from 'vue-toastification';
import VueDatePicker from '@vuepic/vue-datepicker';

const toastOptions = {
    // You can set your default options here
    timeout: 4000,
    maxToasts: 3,
    position: 'bottom-right',
};

const globalComponents = (app: App<Element>) => {
    app.use(Toast, toastOptions);
    app.component('VueDatePicker', VueDatePicker);
};

export default globalComponents;
