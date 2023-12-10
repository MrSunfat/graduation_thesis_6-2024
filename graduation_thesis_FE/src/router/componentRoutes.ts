export default [
    {
        path: '/components',
        name: 'components',
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/componentView/ComponentView.vue'),
    },
];
