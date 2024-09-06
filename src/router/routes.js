export default [
    {
        path: '/',
        component: () => import('@/layout/index.vue'),
        children: [
            {
                path: '/',
                component: () => import('@/pages/home.vue')
            },
            // {
            //     path: '/idphotos',
            //     component: () => import('@/pages/ai/idphotos.vue')
            // },
        ]
    }
]