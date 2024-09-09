const tools = [
    {
        title: '办公工具',
        // icon: 'WindowsOutlined',
        icon: 'icon-bangong',
        path: '/office',
        children: [
            {
                title: '思维导图',
                icon: 'icon-siweidaotu',
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
                component: '/pages/ai/emotivoice'
            },
            {
                title: '文本转图片',
                // icon: 'FileImageOutlined',
                icon: 'icon-image',
                path: '/fooocus',
                component: '/pages/ai/fooocus'
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

export const getTools = () => {
    return tools
}