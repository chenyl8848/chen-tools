<template>
    <a-card>
        <div class="tool">
            <p class="tool-title">思维导图</p>
            <div class="tool-button">
                <!-- <a-button @click="exportMindMap">导出</a-button> -->
                <a class="ant-dropdown-link" @click="exportMindMap">
                    导入
                    <ImportOutlined />
                </a>
                <a-dropdown :trigger="['click']">
                    <a class="ant-dropdown-link" @click="exportMindMap">
                        导出
                        <ExportOutlined />
                    </a>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item key="0">
                                导出为 Svg
                            </a-menu-item>
                            <a-menu-item key="1">
                                导出为 Png
                            </a-menu-item>
                            <a-menu-item key="3">
                                导出为 XMind
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </div>
        <div class="mindMapContainer" ref="mindMapContainerRef">

            <div class="top-menu-fixed">
                <a class="ant-dropdown-link" @click="importMindMap">
                    导入
                    <ImportOutlined />
                </a>
                <a-dropdown :trigger="['click']">
                    <a class="ant-dropdown-link" @click="exportMindMap">
                        导出
                        <ExportOutlined />
                    </a>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item key="0">
                                导出为 Svg
                            </a-menu-item>
                            <a-menu-item key="1">
                                导出为 Png
                            </a-menu-item>
                            <a-menu-item key="3">
                                导出为 XMind
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>

        </div>
        <!-- 右键菜单 -->
        <div v-if="showContextMenu" class="context-menu"
            :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }">
            <ul>
                <li @click="addChildNode">添加子节点</li>
                <li @click="addSameNode">添加同级节点</li>
                <li @click="removeNode">删除节点</li>
                <li @click="copyNode">复制节点</li>
                <li @click="pasteNode">粘贴节点</li>
            </ul>
        </div>
    </a-card>
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
.tool {
    display: flex;
    // align-items: center;

    .tool-title {
        font-size: 16px;
        font-weight: 600;
        justify-content: flex-start;
    }

    .tool-button {
        // display: flex;
        // justify-content: flex-end;
        // float: right;
        justify-content: flex-end;
        flex: 1;
        display: flex;
    }
}

.mindMapContainer {
    margin: 0;
    padding: 0;
    width: 100%;
    height: calc(100vh - 280px)
}
</style>