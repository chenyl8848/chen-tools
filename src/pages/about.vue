<template>
    <a-card>
        <tool-header></tool-header>
        {{ isMobile }}
        <p>
            <a href="https://github.com/chenyl8848/chen-tools" target="_blank">Chen-Tools</a>
            是一款开源免费的在线工具箱，包含开发、文档、作图、媒体、生活等实用工具；如果对您有帮助，请将其分享给您的朋友，并且添加到收藏夹中！顺便再点个⭐️吧！
        </p>
        <a-divider orientation="left">技术栈</a-divider>
        <p>
            主要基于 Vite + Vue + Ant Design Vue + Pinia 开发，某些工具使用了第三方开源库。
        </p>
        <a-divider orientation="left">鸣谢</a-divider>
        <a-list item-layout="horizontal" :data-source="data">
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-list-item-meta :description="item.description">
                        <template #title>
                            <a :href="item.url" target="_blank">{{ item.title }}</a>
                        </template>
                        <template #avatar>
                            <a-avatar :src="item.avatar" />
                        </template>
                    </a-list-item-meta>
                </a-list-item>
            </template>
        </a-list>
        <a-divider dashed />
    </a-card>
</template>

<script setup>

import { useMobile } from '@/hook/global'
const isMobile = useMobile()

const data = [
    {
        title: 'Ant Design Vue',
        url: 'https://antdv.com/components/overview-cn',
        avatar: 'https://next.antdv.com/assets/logo.1ef800a8.svg',
        description: 'Ant Design 的 Vue 实现，开发和服务于企业级后台产品。'
    },
    {
        title: 'VueUse',
        url: 'https://vueuse.nodejs.cn/',
        avatar: 'https://vueuse.nodejs.cn/favicon.svg',
        description: '基础 Vue 组合式工具的集合。'
    },
    {
        title: 'LogicFlow',
        url: 'http://logicflow.cn/tutorial/about',
        avatar: 'https://cdn.jsdelivr.net/gh/Logic-Flow/static@latest/docs/favicon.png',
        description: '一款流程图编辑框架，提供了一系列流程图交互、编辑所必需的功能和灵活的节点自定义、插件等拓展机制。'
    },
    {
        title: 'Univer',
        url: 'https://docs.univer.ai/guides/sheets',
        avatar: 'https://docs.univer.ai/favicon.ico',
        description: '一个开源的办公套件引擎，旨在为开发者提供一个强大、灵活且易于使用的办公套件解决方案。'
    },
    {
        title: 'SimpleMindMap',
        url: 'https://wanglin2.github.io/mind-map-docs/',
        avatar: 'https://wanglin2.github.io/mind-map-docs/logo.png',
        description: '一个 JavaScript 思维导图库，也是一个完整的思维导图工具。'
    },
    {
        title: 'Vditor',
        url: 'https://b3log.org/vditor/',
        avatar: 'https://b3log.org/images/brand/vditor-128.png',
        description: '易于使用的 Markdown 编辑器，为适配不同的应用场景而生。'
    },
    {
        title: 'lucky-canvas',
        url: 'https://100px.net/',
        avatar: 'https://100px.net/logo.png',
        description: '基于 JS + Canvas 实现的【大转盘 & 九宫格 & 老虎机】抽奖。'
    },
    {
        title: 'Linux Command',
        url: 'https://wangchujiang.com/linux-command/hot.html',
        avatar: 'https://wangchujiang.com/linux-command/img/favicon.ico',
        description: 'Linux 命令大全搜索工具，内容包含 Linux 命令手册、详解、学习、搜集。'
    },
]
</script>

<style lang="css" scoped></style>