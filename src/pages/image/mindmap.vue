<template>
    <a-card>
        <tool-header></tool-header>
        <div class="mind-map-container" ref="mindMapContainer" :class="{ fullscreen: isFullScreen.value }">
            <MindMapOperationPane v-if="mindMap && mindMapContainer" :mindMap="mindMap"
                :mindMapContainer="mindMapContainer" />
        </div>
    </a-card>
    <!-- 右键菜单 -->
    <MindMapContextMenu v-if="mindMap && mindMapContainer" :mindMap="mindMap" :mindMapContainer="mindMapContainer">
    </MindMapContextMenu>
</template>

<script setup>
import MindMap from "simple-mind-map"
// 导出插件
import Export from 'simple-mind-map/src/plugins/Export.js'
// 拖拽插件
import Drag from 'simple-mind-map/src/plugins/Drag.js'
// 富文本插件
import RichText from 'simple-mind-map/src/plugins/RichText.js'
// PDF 导出插件
import ExportPDF from 'simple-mind-map/src/plugins/ExportPDF.js'
// XMIND 导出插件
import ExportXMind from 'simple-mind-map/src/plugins/ExportXMind.js'
// 关联线插件
import AssociativeLine from 'simple-mind-map/src/plugins/AssociativeLine.js'
import { onMounted, onUnmounted, ref, watch } from "vue"
import { useFullScreen } from '@/hook/global'
import { LOCAL_STORAGE_CODE_MIND_MAP_VALUE_KEY } from '@/utils/enum'
import Themes from 'simple-mind-map-plugin-themes'
// 注册主题
Themes.init(MindMap)
// 导入子组件
import MindMapOperationPane from '@/components/MindMapOperationPane.vue'
import MindMapContextMenu from "@/components/MindMapContextMenu.vue"

MindMap.usePlugin(Export)
MindMap.usePlugin(Drag)
MindMap.usePlugin(RichText)
MindMap.usePlugin(AssociativeLine)
MindMap.usePlugin(ExportPDF)
MindMap.usePlugin(ExportXMind)

const mindMapContainer = ref()
const mindMap = ref(null)
const mindMapData = {
    data: {
        "text": "根节点"
    },
    children: [{
        "data": {
            "text": "Child Node 1",
            "image": "",
            "imageTitle": "",
            "hyperlink": "",
            "note": ""
        },
        "children": []
    },
    {
        "data": {
            "text": "Child Node 2",
            "image": "",
            "imageTitle": "",
            "hyperlink": "",
            "note": ""
        },
        "children": []
    }]
}

const [isFullScreen, fullScreen, exitFullScreen, toggleFullScreen, removeFullScreenListeners] = useFullScreen(mindMapContainer.value)

let { root, layout, theme, view } = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CODE_MIND_MAP_VALUE_KEY)) || {}
const initMindMap = () => {
    mindMap.value = new MindMap({
        el: mindMapContainer.value,
        // data: mindMapData,
        data: root || mindMapData,
        layout,
        theme,
        view
    })

    // 监听窗口大小变化，重新渲染脑图
    window.addEventListener('resize', () => {
        if (mindMap.value) {
            mindMap.value.resize()
        }
    })
}

onMounted(() => {
    initMindMap()
})

onUnmounted(() => {
    // 组件销毁时移除事件监听器
    removeFullScreenListeners()

    // 移除窗口大小变化监听器
    window.removeEventListener('resize', () => {
        if (mindMap.value) {
            mindMap.value.resize()
        }
    })
})

// 监听全屏状态变化，重新调整脑图大小
watch(isFullScreen, (newVal) => {
    setTimeout(() => {
        if (mindMap.value) {
            mindMap.value.resize()
        }
    }, 100)
})
</script>

<style lang="scss" scoped>
.mind-map-container {
    position: relative;
    margin: 0;
    padding: 0;
    width: 100%;
    height: calc(100vh - 260px);

    &.fullscreen {
        height: 100vh !important;
    }
}
</style>