<template>
    <a-card :bordered="false">
        <tool-header />

        <div class="board">
            <div ref="host" class="board-host"></div>
        </div>
    </a-card>
</template>

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { Excalidraw } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const host = ref(null)

// 不能放模块作用域（会被多个实例共享），也不能用 ref（Vue 的深层代理会包住 React 内部结构）
let root = null

onMounted(() => {
    root = createRoot(host.value)
    root.render(createElement(Excalidraw, { langCode: 'zh-CN' }))
})

onBeforeUnmount(() => {
    // 先置空再卸载：快速切走又切回时，旧实例的卸载不能碰掉新实例的 root
    const current = root
    root = null
    current?.unmount()
})
</script>

<style lang="scss" scoped>
.board {
    height: calc(100vh - 270px);
    min-height: 480px;
}

// Excalidraw 会撑满父元素，并用绝对定位放浮层；父级高度为 0 时它画出来的画布也是 0
.board-host {
    position: relative;
    height: 100%;
}

@media (max-width: 1100px) {
    .board {
        height: auto;
        min-height: 70vh;
    }
}
</style>
