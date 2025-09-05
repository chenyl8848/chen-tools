<template>
    <a-card style="height: calc(100vh - 260px)">
        <tool-header></tool-header>
        <div class="linux-container">
            <div class="logo">
                <img src="@/assets/images/linux.webp"></img>
            </div>
            <div class="body">
                <a-input-search v-model:value="searchText" placeholder="请输入关键词搜索" @search="onSearch" allowClear />
                <a-card>
                    <a-list item-layout="horizontal" :data-source="searchCmds" :locale="{ emptyText: '暂无数据' }"
                        v-show="showCmds">
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
                </a-card>
                <div v-html="markdownContent" style="height: 200px;"></div>
            </div>
        </div>
    </a-card>
</template>

<script setup>
import cmd from 'linux-command'
import { ref } from 'vue'
import MarkdownIt from 'markdown-it'
// 引入highlight.js
import hljs from 'highlight.js'
// 选择一个CSS样式
// import 'highlight.js/styles/github.css'
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

const searchText = ref('')
const searchCmds = ref([])
const showCmds = ref(false)
const markdownContent = ref('')

const onSearch = () => {
    showCmds.value = true
    const keys = Object.keys(cmd).filter((item) => item.includes(searchText.value))
    const cmds = []
    keys.forEach((key) => {
        cmds.push(cmd[key])
    })
    searchCmds.value = [...cmds]
}

const showCmd = async (cmd) => {
    console.log(cmd, cmd.n)
    showCmds.value = false
    const path = `/node_modules/linux-command/command${cmd.p}.md?raw`
    const rawModule = await import(/* @vite-ignore */path)
    // 获取模块的默认导出（即文件内容）
    const rawContent = rawModule.default
    markdownContent.value = md.render(rawContent)
}
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
</style>