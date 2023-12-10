// import { componentView } from '@/views/AboutView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import homeRoutes from './homeRoutes';
import aboutRoutes from './aboutRoutes';
import componentRoutes from './componentRoutes';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...homeRoutes, ...aboutRoutes, ...componentRoutes],
});

export default router;
