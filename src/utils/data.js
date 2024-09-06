export const menus = [
    {
        title: '办公工具',
        // icon: 'WindowsOutlined',
        icon: 'icon-bangong',
        path: '/office',
        component: '/layout/index',
        children: [
            {
                title: '思维导图',
                icon: 'icon-siweidaotu',
                path: '/mind',
                component: '/pages/ai/idphotos'
            },
        ]
    },
    {
        title: 'AI 工具',
        // icon: 'BulbOutlined',
        icon: 'icon-wuguan',
        path: '/ai',
        component: '/layout/index',
        children: [
            {
                title: '生成证件照',
                // icon: 'IdcardOutlined',
                icon: 'icon-6zhengjianzhaopian',
                path: '/idphotos',
                component: '/pages/ai/idphotos'
            },
            {
                title: '文本转语音',
                // icon: 'ItalicOutlined',
                icon: 'icon-voice',
                path: '/emotivoice',
                component: '/ai/idphotos'
            },
            {
                title: '文本转图片',
                // icon: 'FileImageOutlined',
                icon: 'icon-image',
                path: '/fooocus',
                component: '/ai/idphotos'
            }
        ]
    },
    {
        title: '关于本站',
        // icon: 'InfoCircleOutlined',
        icon: 'icon-about',
        path: '/about',
        component: '/ai/idphotos'
    }
]