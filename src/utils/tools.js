const tools = [
    {
        title: '开发工具',
        icon: 'icon-kaifagongju',
        path: '/dev',
        children: [
            {
                title: 'URL 编码解码',
                description: 'URL 编码解码',
                icon: 'icon-Url',
                favicon: '/images/url.svg',
                path: '/url',
                component: '/pages/dev/url'
            },
            {
                title: 'JWT 生成解析',
                description: '生成和解析 JSON Web Token(JWT)并显示其内容',
                icon: 'icon-token',
                favicon: '/images/jwt.svg',
                path: '/jwt',
                component: '/pages/dev/jwt'
            },
            {
                title: '时间戳转换',
                description: '时间戳转换',
                icon: 'icon-shijianchuo',
                favicon: '/images/timestamp.svg',
                path: '/timestamp',
                component: '/pages/dev/timestamp'
            },
            {
                title: 'JSON 格式化',
                description: 'JSON 格式化工具',
                icon: 'icon-json',
                favicon: '/images/json.svg',
                path: '/json',
                component: '/pages/dev/json'
            },
            {
                title: 'Linux 命令查询',
                description: 'Linux 命令大全搜索工具，内容包含 Linux 命令手册、详解、学习、搜集',
                icon: 'icon-linux',
                favicon: '/images/linux.svg',
                path: '/linux',
                component: '/pages/dev/linux'
            },
            {
                title: '颜色选择器',
                description: '颜色选择器',
                icon: 'icon-color-picker',
                favicon: '/images/color-picker.svg',
                path: '/color',
                component: '/pages/dev/color'
            },
            {
                title: '图片转 Base64 编码',
                description: '图片/Base64 编码互转',
                icon: 'icon-base64',
                favicon: '/images/base64.svg',
                path: '/base64',
                component: '/pages/dev/base64'
            }
        ]
    },
    {
        title: '文档工具',
        icon: 'icon-wendanggongju',
        path: '/document',
        children: [
            {
                title: '在线表格',
                description: 'Excel 在线表格',
                icon: 'icon-excel',
                favicon: '/images/excel.svg',
                path: '/excel',
                component: '/pages/document/excel'
            },
            {
                title: 'Word 文档编辑器',
                description: 'Word 文档编辑器',
                icon: 'icon-word',
                favicon: '/images/word.svg',
                path: '/word',
                component: '/pages/document/word'
            },
            {
                title: '富文本编辑器',
                description: "基于 <a href='https://github.com/Vanessa219/vditor' target='_blank'>Vditor</a> 实现，所见即所得，支持分屏预览",
                icon: 'icon-markdown',
                favicon: '/images/markdown.svg',
                path: '/markdown',
                component: '/pages/document/markdown'
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
                description: '简单&强大的 Web 思维导图',
                icon: 'icon-siweidaotu',
                favicon: '/images/xmind.png',
                path: '/mindmap',
                component: '/pages/image/mindmap'
            },
            {
                title: '流程图',
                description: '流程图、ER图、BPMN流程',
                icon: 'icon-liuchengtu',
                favicon: '/images/flow.svg',
                path: '/logicflow',
                component: '/pages/image/logicflow'
            },
            {
                title: '手绘白板',
                description: '虚拟白板，用于勾画手绘般的图表',
                icon: 'icon-huiyishi',
                favicon: '/images/whiteboard.svg',
                path: '/whiteboard',
                component: '/pages/image/whiteboard'
            },
            {
                title: '签名画板',
                description: "基于 <a href='https://github.com/szimek/signature_pad' target='_blank'>Signature Pad</a> 实现的签名绘制画板",
                icon: 'icon-huaban',
                favicon: '/images/signature.svg',
                path: '/signature',
                component: '/pages/image/signature'
            },
            {
                title: '二维码生成器',
                description: '二维码生成',
                icon: 'icon-qr',
                favicon: '/images/qr.svg',
                path: '/qr',
                component: '/pages/image/qr'
            },
            {
                title: '图片裁剪',
                description: '图片裁剪',
                icon: 'icon-qr',
                favicon: '/images/qr.svg',
                path: '/crop',
                component: '/pages/image/crop'
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
            //     description: '一键生成高清短视频',
            //     icon: 'icon-6zhengjianzhaopian',
            //     favicon: '/images/movie.png',
            //     path: '/movie',
            //     component: '/pages/ai/movie'
            // },
            {
                title: '生成证件照',
                description: '轻量级的 AI 证件照制作',
                icon: 'icon-6zhengjianzhaopian',
                favicon: '/images/idphotos.png',
                path: '/idphotos',
                component: '/pages/ai/idphotos'
            },
            {
                title: '文本转图片',
                description: '文本生成图像',
                icon: 'icon-image',
                favicon: '/images/img.webp',
                path: '/images/fooocus',
                component: '/pages/ai/fooocus'
            },
            {
                title: '文本转语音',
                description: '文本转语音，支持中英文双语',
                icon: 'icon-voice',
                favicon: '/images/voice.png',
                path: '/emotivoice',
                component: '/pages/ai/emotivoice'
            },
        ]
    },
    {
        title: '媒体工具',
        // icon: 'BulbOutlined',
        icon: 'icon-lanmuzimeiti',
        path: '/media',
        children: [
            {
                title: '抖音去水印下载',
                description: '抖音去水印批量下载用户主页作品',
                icon: 'icon-douyin',
                favicon: '/images/douyin.svg',
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
                description: '大转盘/九宫格/老虎机',
                icon: 'icon-choujiang',
                favicon: '/images/lottery.svg',
                path: '/lottery',
                component: '/pages/other/lottery'
            },
            {
                title: '亲戚称谓计算器',
                description: '大转盘/九宫格/老虎机',
                icon: 'icon-jisuanqilishuai',
                favicon: '/images/calculator.svg',
                path: '/relatives',
                component: '/pages/other/relative'
            },
            {
                title: '烟花',
                description: '',
                icon: 'icon-firework',
                favicon: '/images/firework.svg',
                path: '/firework',
                component: '/pages/other/firework'
            },
            {
                title: '完结撒花',
                description: '',
                icon: 'icon-firework',
                favicon: '/images/firework.svg',
                path: '/confetti',
                component: '/pages/other/confetti'
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