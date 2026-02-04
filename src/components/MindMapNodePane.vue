<template>
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
import { defineProps, onMounted, ref, shallowRef } from 'vue'
const $props = defineProps({
    mindMap: Object,
    mindMapContainer: Object,
})

const { mindMap, mindMapContainer } = $props

const initMindMap = () => {
    mindMap.on('node_contextmenu', (e, node) => {
        if (e.which == 3) {
            menuPosition.value = { x: e.clientX + 10, y: e.clientY + 10 }
            showContextMenu.value = true
            currentNode.value = node
        }
    })

    // 点击空白处
    mindMap.on('node_click', hideContextMenu)
    mindMap.on('draw_click', hideContextMenu)
    mindMap.on('expand_btn_click', hideContextMenu)
}

// 节点右键事件
const showContextMenu = ref(false)
const menuPosition = ref({ x: 0, y: 0 })
// 如果点击的节点，那么代表被点击的节点
const currentNode = shallowRef(null)

// 右键菜单按钮点击事件
const handleContextMenuBtn = (type) => {
    if (!mindMap) {
        console.error('mindMap is not available');
        return;
    }

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
</script>

<style lang="scss" scoped>
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