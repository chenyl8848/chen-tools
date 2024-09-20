<template>
    <a-card>
        <p class="title">思维导图</p>
        <div class="mindMapContainer" ref="mindMapContainerRef">
        </div>
        <div class="left-fixed-menu">
            <a-card>
            </a-card>
        </div>
        <div class="top-fixed-menu">
            <a-card>
            </a-card>
        </div>
    </a-card>
    <!-- 右键菜单 -->
    <div v-if="showContextMenu" class="context-menu"
        :style="{ zIndex: 2000, top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }">
        <ul>
            <li @click="addChildNode">添加子节点</li>
            <li @click="addSameNode">添加同级节点</li>
            <li @click="removeNode">删除节点</li>
            <li @click="copyNode">复制节点</li>
            <li @click="pasteNode">粘贴节点</li>
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
import { onMounted, ref, shallowRef } from "vue"

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
const initMindMap = () => {
    mindMap = new MindMap({
        el: mindMapContainerRef.value,
        data: mindMapData
    })

    mindMap.on('node_contextmenu', (e, node) => {
        if (e.which == 3) {
            menuPosition.value = { x: e.clientX + 10, y: e.clientY + 10 };
            showContextMenu.value = true;
            currentNode.value = node
        }
    })

    // 点击空白处
    mindMap.on('node_click', hide)
    mindMap.on('draw_click', hide)
    mindMap.on('expand_btn_click', hide)
}

// 导入
const importMindMap = () => {

}

// 导出
const exportMindMap = async (key) => {
    console.log(key, "keyyyyyyyyyyyy")
    // let data = await mindMap.doExport.png()
    // // ...
    // console.log(data, "dddddddddddddd")
    // let a = document.createElement('a')
    // // .png、.svg、.pdf、.md、.json、.smm
    // a.href = data
    // a.download = 'xxx'
    // a.click()
}

// 隐藏右侧菜单
const hide = () => {
    menuPosition.value = { x: 0, y: 0 };
    showContextMenu.value = false;
    currentNode.value = null
}

onMounted(() => {
    initMindMap()
})
</script>

<style lang="scss">
.title {
    font-size: 16px;
    font-weight: 600;
}

.mindMapContainer {
    margin: 0;
    padding: 0;
    width: 100%;
    height: calc(100vh - 260px)
}

.left-fixed-menu {
    position: fixed;
    top: 20%;
    z-index: 1000;
    margin-left: 12px;

    .ant-card .ant-card-body {
        padding: 0%;
        display: flex;
        flex-direction: column;

        .btn-block {
            margin-top: 12px;
        }
    }

    .ant-btn-link {
        color: black;
    }
}

.top-fixed-menu {
    position: fixed;
    top: 180px;
    z-index: 1000;
    right: 100px;

    .ant-card .ant-card-body {
        padding: 0%;
        display: flex;

        .btn-block {
            margin-top: 12px;
        }
    }

    .ant-btn-link {
        color: black;
    }
}
</style>