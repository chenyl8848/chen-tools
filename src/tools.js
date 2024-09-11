const tools = [
    {
        title: '办公工具',
        // icon: 'WindowsOutlined',
        icon: 'icon-bangong',
        path: '/office',
        children: [
            {
                title: '思维导图',
                description: "简单&强大的 Web 思维导图",
                icon: 'icon-siweidaotu',
                favicon: '/src/assets/images/xmind.png',
                path: '/mindmap',
                component: '/pages/office/mindmap'
            },
        ]
    },
    {
        title: 'AI 工具',
        // icon: 'BulbOutlined',
        icon: 'icon-wuguan',
        path: '/ai',
        children: [
            // {
            //     title: '生成短视频',
            //     description: "一键生成高清短视频",
            //     icon: 'icon-6zhengjianzhaopian',
            //     favicon: '/src/assets/images/movie.png',
            //     path: '/movie',
            //     component: '/pages/ai/movie'
            // },
            {
                title: '生成证件照',
                description: "轻量级的 AI 证件照制作",
                icon: 'icon-6zhengjianzhaopian',
                favicon: '/src/assets/images/idphotos.png',
                path: '/idphotos',
                component: '/pages/ai/idphotos'
            },
            {
                title: '文本转图片',
                description: "文本生成图像",
                icon: 'icon-image',
                favicon: 'https://tools.ranblogs.com/images/logo/img.png',
                path: '/fooocus',
                component: '/pages/ai/fooocus'
            },
            {
                title: '文本转语音',
                description: "强大的文本转语音工具，支持中英文双语",
                icon: 'icon-voice',
                favicon: '/src/assets/images/voice.png',
                path: '/emotivoice',
                component: '/pages/ai/emotivoice'
            },
        ]
    },
    {
        title: '关于本站',
        icon: 'icon-about',
        path: '/about',
        component: '/pages/about'
    },
    {
        title: '打赏作者',
        icon: 'icon-comment-outlined',
        path: '/reward',
        component: '/pages/reward'
    },
    {
        title: '留言反馈',
        icon: 'icon-comment-outlined',
        path: '/issue',
        component: '/pages/issue'
    }
]

export const getTools = () => {
    return tools
}