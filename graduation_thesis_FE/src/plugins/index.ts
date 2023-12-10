import type { App } from 'vue';
import globalCompsPlugins from './globalComponents';
import globalConfigs from './globalConfigs';

const globalPlugins = (app: App<Element>) => {
    globalConfigs(app);
    globalCompsPlugins(app);
};

export default globalPlugins;
