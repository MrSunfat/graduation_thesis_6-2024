import { createRouter, createWebHistory } from 'vue-router';
import homeRoutes from './homeRoutes';
import aboutRoutes from './aboutRoutes';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...homeRoutes, ...aboutRoutes],
});

export default router;
