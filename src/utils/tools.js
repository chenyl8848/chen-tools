const tools = [
    {
        title: '文档工具',
        icon: 'icon-wendanggongju',
        path: '/document',
        children: [
            {
                title: '在线表格',
                description: "Excel 在线表格",
                icon: 'icon-Excel',
                favicon: '/src/assets/images/excel.svg',
                path: '/excel',
                component: '/pages/document/excel'
            }
        ]
    },
    {
        title: '作图工具',
        icon: 'icon-xianxingliangzhicaozuotubiao',
        path: '/image',
        children: [
            {
                title: '思维导图',
                description: "简单&强大的 Web 思维导图",
                icon: 'icon-siweidaotu',
                favicon: '/src/assets/images/xmind.png',
                path: '/mindmap',
                component: '/pages/image/mindmap'
            },
            {
                title: '流程图',
                description: "流程图、ER图、BPMN流程",
                icon: 'icon-liuchengtu',
                favicon: '/src/assets/images/flow.svg',
                path: '/logicflow',
                component: '/pages/image/logicflow'
            },
            {
                title: '手绘白板',
                description: "虚拟白板，用于勾画手绘般的图表",
                icon: 'icon-huiyishi',
                favicon: '/src/assets/images/whiteboard.svg',
                path: '/whiteboard',
                component: '/pages/image/whiteboard'
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
                description: "文本转语音，支持中英文双语",
                icon: 'icon-voice',
                favicon: '/src/assets/images/voice.png',
                path: '/emotivoice',
                component: '/pages/ai/emotivoice'
            },
        ]
    },
    {
        title: '自媒体工具',
        // icon: 'BulbOutlined',
        icon: 'icon-lanmuzimeiti',
        path: '/media',
        children: [
            {
                title: '抖音去水印下载',
                description: "抖音去水印批量下载用户主页作品",
                icon: 'icon-douyin',
                favicon: '/src/assets/images/douyin.svg',
                path: '/movie',
                component: '/pages/media/douyin'
            }
        ]
    },
    {
        title: '其他工具',
        // icon: 'BulbOutlined',
        icon: 'icon-qita',
        path: '/other',
        children: [
            {
                title: '抽奖',
                description: "大转盘/九宫格/老虎机",
                icon: 'icon-choujiang',
                favicon: '/src/assets/images/lottery.svg',
                path: '/lottery',
                component: '/pages/other/lottery'
            },
            {
                title: '亲戚称谓计算器',
                description: "大转盘/九宫格/老虎机",
                icon: 'icon-jisuanqilishuai',
                favicon: '/src/assets/images/calculator.svg',
                path: '/relatives',
                component: '/pages/other/relative'
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
        icon: 'icon-dashang',
        path: '/reward',
        component: '/pages/reward'
    },
    {
        title: '留言反馈',
        icon: 'icon-liuyanfankui',
        path: '/issue',
        component: '/pages/issue'
    }
]

const myFavoriteTool = {
    title: '我的收藏',
    icon: 'icon-shoucang',
    path: '/favorite',
    children: []
}

export const getTools = () => {
    return tools
}

export const getMyFavoriteTool = () => {
    return myFavoriteTool
}

export const getParentTool = (path) => {
    return tools.filter((item) => item.children).find((item1) => item1.children.findIndex((item2) => item2.path === path) > -1)
}

export const getSearchTools = (toolTitle) => {
    if (!toolTitle) {
        return []
    }
    const allTools = []
    tools.filter((item) => item.children).forEach((item1) => item1.children.forEach((item2) => allTools.push(item2)))

    return allTools.filter((item) => item.title.indexOf(toolTitle) > -1)
}