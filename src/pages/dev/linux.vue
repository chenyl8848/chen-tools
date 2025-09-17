<template>
    <a-card style="height: calc(100vh - 260px)">
        <tool-header></tool-header>
        <div class="linux-container">
            <div class="logo">
                <img src="@/assets/images/linux.webp"></img>
            </div>
            <div class="body">
                <a-input-search v-model:value="searchText" placeholder="请输入关键词搜索" @search="onSearch" allowClear :loading="loading"/>
                <a-list item-layout="horizontal" :data-source="searchCmds" :locale="{ emptyText: '暂无数据' }" size="small"
                    bordered :loading="loading" v-show="showCmds">
                    <template #renderItem="{ item }">
                        <a-list-item>
                            <a-list-item-meta>
                                <template #title>
                                    <!-- {{ item }} -->
                                    <a-button type="link" @click="showCmd(item)">
                                        <!-- <p>{{ item.title }} - {{ item.description }}</p> -->
                                        <p>{{ item.n }} - {{ item.d }}</p>
                                    </a-button>
                                </template>
                            </a-list-item-meta>
                        </a-list-item>
                    </template>
                </a-list>
            </div>
        </div>
        <a-modal v-model:open="modal" width="45%" centered>
            <template #footer>
                <a-button key="submit" type="primary" @click="handleOk">确认</a-button>
            </template>
            <div v-html="markdownContent"></div>
        </a-modal>
    </a-card>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

import MarkdownIt from 'markdown-it'
// // 引入highlight.js
// import hljs from 'highlight.js'
// // 选择一个CSS样式
// import 'highlight.js/styles/github.css'
import hljs from "highlight.js/lib/core"
import "highlight.js/styles/ir-black.css"
import shell from 'highlight.js/lib/languages/shell'

hljs.registerLanguage('shell', shell)

const md = new MarkdownIt({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>';
            } catch (__) { }
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
})

let cmd = {}
const searchText = ref('')
const searchCmds = ref([])
const showCmds = ref(false)
const markdownContent = ref('')
const loading = ref(false)
const modal = ref(false)

const initCmd = async () => {
    loading.value = true
    try {
        const { data } = await axios.get('https://unpkg.com/linux-command/dist/data.json')
        cmd = { ...data }
    } finally {
        loading.value = false
    }
}

const onSearch = () => {
    if (searchText.value) {
        showCmds.value = true
        const keys = Object.keys(cmd).filter((item) => item.includes(searchText.value))
        const cmds = []
        keys.forEach((key) => {
            cmds.push(cmd[key])
        })
        searchCmds.value = [...cmds]
    } else {
        showCmds.value = false
    }
}

const showCmd = async (cmd) => {
    console.log(cmd, cmd.n)
    // showCmds.value = false
    // const path = `/node_modules/linux-command/command${cmd.p}.md?raw`
    // const rawModule = await import(/* @vite-ignore */path)
    // // 获取模块的默认导出（即文件内容）
    // const rawContent = rawModule.default
    // markdownContent.value = md.render(rawContent)

    try {
        loading.value = true
        const { data } = await axios.get(`https://unpkg.com/linux-command/command${cmd.p}.md`)
        // showCmds.value = false
        markdownContent.value = md.render(data)
        modal.value = true
    } finally {
        loading.value = false
    }
}

const handleOk = () => {
    modal.value = false
}

onMounted(() => {
    initCmd()
})
</script>

<style lang="css" scoped>
.linux-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    .logo {
        min-height: 140px;
        display: flex;
        align-items: center;
    }

    .body {
        width: 50%;
    }
}

:deep(.ant-list .ant-list-item) {
    padding: 8px;
}

:deep(.ant-btn) {
    font-size: 16px;
    color: black;
}
</style>