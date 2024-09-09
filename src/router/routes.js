export default [
    {
        path: '/',
        component: () => import('@/pages/home.vue')
    },
    {
        path: '/:catchAll(.*)',
        component: () => import('@/pages/404.vue'),
      },
]