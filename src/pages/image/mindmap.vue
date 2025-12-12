<template>
    <a-card>
        <p class="title">思维导图</p>
        <div class="mind-map-container" ref="mindMapContainerRef" :class="{ fullscreen: isFullScreen.value }">
            <div class="operation-btn">
                <a-space wrap>
                    <a-tooltip title="导入" placement="bottom">
                        <a-button @click="importMindMap" type="text" shape="circle" :icon="h(ExportOutlined)" />
                    </a-tooltip>
                    <a-tooltip title="导出" placement="bottom">
                        <a-button @click="exportMindMap" type="text" shape="circle" :icon="h(ImportOutlined)" />
                    </a-tooltip>
                    <a-tooltip title="全屏" placement="bottom">
                        <a-button @click="toggleFullScreen" type="text" shape="circle" :icon="h(FullscreenOutlined)"
                            v-show="!isFullScreen" />
                    </a-tooltip>
                    <a-tooltip title="退出全屏" placement="bottom">
                        <a-button @click="toggleFullScreen" type="text" shape="circle" :icon="h(FullscreenExitOutlined)"
                            v-show="isFullScreen" />
                    </a-tooltip>
                    <a-tooltip placement="bottom">
                        <template #title>
                            <div style="white-space: pre-line;">
                                {{ shortcutKeyText }}
                            </div>
                        </template>
                        <QuestionOutlined />
                    </a-tooltip>
                    <a-tooltip title="主题" placement="bottom">
                        <a-button @click="setTheme" type="text" shape="circle" :icon="h(SkinOutlined)" />
                    </a-tooltip>
                </a-space>
            </div>
        </div>
    </a-card>
    <!-- 右键菜单 -->
    <div v-if="showContextMenu" class="context-menu"
        :style="{ zIndex: 2000, top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }">
        <ul>
            <li @click="handleContextMenuBtn('addChildNode')">添加子节点</li>
            <li @click="handleContextMenuBtn('addSameNode')">添加同级节点</li>
            <li @click="handleContextMenuBtn('removeNode')">删除节点</li>
            <li @click="handleContextMenuBtn('copyNode')">复制节点</li>
            <li @click="handleContextMenuBtn('pasteNode')">粘贴节点</li>
        </ul>
    </div>
</template>

<script setup>
import MindMap from "simple-mind-map"
// 导出插件
import Export from 'simple-mind-map/src/plugins/Export.js'
// 拖拽插件
import Drag from 'simple-mind-map/src/plugins/Drag.js'
import RichText from 'simple-mind-map/src/plugins/RichText.js'
import { onMounted, onUnmounted, ref, shallowRef, h, watch } from "vue"
import { FullscreenOutlined, ExportOutlined, ImportOutlined, FullscreenExitOutlined, SkinOutlined } from '@ant-design/icons-vue'
import { useFullScreen } from '@/hook/global'
import { MIND_MAP_SHORTCUTS } from '@/utils/enum'
import Themes from 'simple-mind-map-plugin-themes'
// 注册主题
Themes.init(MindMap)
import themeList from 'simple-mind-map-plugin-themes'

MindMap.usePlugin(Export)
MindMap.usePlugin(Drag)
MindMap.usePlugin(RichText)

const mindMapContainerRef = ref()
const mindMapData = {
    "data": {
        "text": "根节点"
    },
    "children": [{
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

let mindMap = null

// 节点右键事件
const showContextMenu = ref(false)
const menuPosition = ref({ x: 0, y: 0 })
// 如果点击的节点，那么代表被点击的节点
const currentNode = shallowRef(null)

// 快捷键提示
// const shortcutKeyText = ref('Tab: 导出\nCtrl + Alt + F: 全屏\nCtrl + Alt + Enter: 退出全屏')
const shortcutKeyText = ref(MIND_MAP_SHORTCUTS.map(category =>
    `${category.type}\n${category.list.map(item => `${item.value}: ${item.name}`).join('\n')}`
).join('\n\n'))

const [isFullScreen, fullScreen, exitFullScreen, toggleFullScreen, removeFullScreenListeners] = useFullScreen(mindMapContainerRef)

const initMindMap = () => {
    mindMap = new MindMap({
        el: mindMapContainerRef.value,
        data: mindMapData,
        theme: 'classic',
    })

    mindMap.on('node_contextmenu', (e, node) => {
        if (e.which == 3) {
            menuPosition.value = { x: e.clientX + 10, y: e.clientY + 10 };
            showContextMenu.value = true;
            currentNode.value = node
        }
    })

    // 点击空白处
    mindMap.on('node_click', hideContextMenu)
    mindMap.on('draw_click', hideContextMenu)
    mindMap.on('expand_btn_click', hideContextMenu)

    // 监听窗口大小变化，重新渲染脑图
    window.addEventListener('resize', () => {
        if (mindMap) {
            mindMap.resize()
        }
    })
}

// 导入
const importMindMap = () => {

}

// 导出
const exportMindMap = async (key) => {
    console.log(key, "keyyyyyyyyyyyy")
    let data = await mindMap.doExport.png()
    // ...
    console.log(data, "dddddddddddddd")
    let a = document.createElement('a')
    // .png、.svg、.pdf、.md、.json、.smm
    a.href = data
    a.download = 'xxx'
    a.click()
}

// 设置主题
const setTheme = () => {
    const theme = mindMap.getTheme()
    console.log(themeList, "theme")
    const themeIndex = themeList.lightList.findIndex(item => item.name === theme)
    const nextTheme = themeList.lightList[themeIndex + 1] || themeList[0]
    console.log(nextTheme, "nextTheme")
    mindMap.setTheme(nextTheme.value)
}

// 右键菜单按钮点击事件
const handleContextMenuBtn = (type) => {
    switch (type) {
        case 'addChildNode':
            mindMap.execCommand('INSERT_CHILD_NODE')
            break
        case 'addSameNode':
            mindMap.execCommand('INSERT_NODE')
            break
        case 'removeNode':
            mindMap.execCommand('REMOVE_NODE')
            break
        case 'copyNode':
            mindMap.renderer.copy()
            break
        case 'pasteNode':
            mindMap.renderer.paste()
            break
        default:
            break
    }

    hideContextMenu()
}

// 隐藏右侧菜单
const hideContextMenu = () => {
    menuPosition.value = { x: 0, y: 0 };
    showContextMenu.value = false;
    currentNode.value = null
}

onMounted(() => {
    initMindMap()
})

onUnmounted(() => {
    // 组件销毁时移除事件监听器
    removeFullScreenListeners()

    // 移除窗口大小变化监听器
    window.removeEventListener('resize', () => {
        if (mindMap) {
            mindMap.resize()
        }
    })
})

// 监听全屏状态变化，重新调整脑图大小
watch(isFullScreen, (newVal) => {
    setTimeout(() => {
        if (mindMap) {
            mindMap.resize()
        }
    }, 100)
})
</script>
<style lang="scss">
.title {
    font-size: 16px;
    font-weight: 600;
}

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

.operation-btn {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3000;
    background-color: #fff;
}

.context-menu {
    position: fixed;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #e8e8e8;
    min-width: 160px;
    z-index: 2000;

    ul {
        list-style: none;
        padding: 8px 0;
        margin: 0;

        li {
            padding: 8px 16px;
            cursor: pointer;
            font-size: 14px;
            color: #333;
            transition: all 0.2s;

            &:hover {
                background-color: #f0f7ff;
                color: #1890ff;
            }
        }
    }
}
</style>