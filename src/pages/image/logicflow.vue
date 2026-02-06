<template>
    <a-card>
        <tool-header></tool-header>
        <div class="logic-flow-container" ref="logicFlowContainer">
            <LogicFlowOperationPane v-if="logicFlow && logicFlowContainer" :logicFlow="logicFlow" :logicFlowContainer="logicFlowContainer">
            </LogicFlowOperationPane>
            <LogicFlowNodePane v-if="logicFlow && logicFlowContainer" :logicFlow="logicFlow"></LogicFlowNodePane>
        </div>
    </a-card>
</template>

<script setup>
import LogicFlowNodePane from "@/components/LogicFlowNodePane.vue"
import LogicFlowOperationPane from "@/components/LogicFlowOperationPane.vue"
import LogicFlow from "@logicflow/core"
import { Menu, MiniMap, Snapshot, SelectionSelect } from '@logicflow/extension'
import "@logicflow/core/lib/style/index.css"
import "@logicflow/extension/lib/style/index.css"
import { onMounted, ref } from "vue"
import { LOCAL_STORAGE_LOGIC_FLOW_GRAOH_DATA_KEY } from "@/utils/enum"

const logicFlowContainer = ref()
let logicFlow = ref(null)

// 流程图数据
const graphData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LOGIC_FLOW_GRAOH_DATA_KEY)) || {}

const initLogicFlow = () => {
    LogicFlow.use(Menu)
    LogicFlow.use(MiniMap)
    LogicFlow.use(Snapshot)
    LogicFlow.use(SelectionSelect)

    logicFlow.value = new LogicFlow({
        container: logicFlowContainer.value,
        outline: true,
        // 调整节点大小
        allowResize: true,
        // 旋转节点
        allowRotate: true,
        nodeTextDraggable: true,
        edgeTextDraggable: true,
        multipleSelectKey: 'shift',
        grid: {
            size: 15,
            visible: true,
            type: 'mesh',
            config: {
                color: '#DCDCDC',
                thickness: 1,
            },
        },
        keyboard: {
            enabled: true
        },
        style: {
            // 矩形样式
            rect: {
                radius: 8,
                stroke: '#333'
            },
            // 圆形样式
            // 圆形样式
            circle: {
                r: 50,
                stroke: '#333'
            },
            // 菱形样式
            diamond: {
                stroke: '#333'
            },
            // 多边形
            polygon: {
                stroke: '#333',
            },
            polyline: {
                strokeWidth: 1,
            },
            edgeText: {
                background: {
                    fill: 'white',
                },
            },
        },
        pluginsOptions: {
            miniMap: {
                headerTitle: ''
            },
        },
    })

    logicFlow.value.extension.menu.setMenuConfig({
        // 覆盖默认的节点右键菜单
        nodeMenu: [
            {
                text: "编辑",
                callback(node) {
                    logicFlow.value.editText(node.id);
                },
            },
            {
                text: "复制",
                callback(node) {
                    logicFlow.value.cloneNode(node.id);
                },
            },
            {
                text: "删除",
                callback(node) {
                    logicFlow.value.deleteNode(node.id);
                },
            },
        ],
        // 删除默认的边右键菜单
        edgeMenu: false,
        // 覆盖默认的边右键菜单，与false表现一样
        graphMenu: [],
    });

    logicFlow.value.render(graphData)

    // 监听画布变化，实时保存数据
    logicFlow.value.on('history:change', () => {
        localStorage.setItem(LOCAL_STORAGE_LOGIC_FLOW_GRAOH_DATA_KEY, JSON.stringify(logicFlow.value.getGraphData()))
    })

    // 关闭选区
    logicFlow.value.on('selection:selected', () => {
        logicFlow.value.extension.selectionSelect.closeSelectionSelect();
    })
}

onMounted(() => {
    initLogicFlow()
})
</script>

<style lang="scss" scoped>
.logic-flow-container {
    position: relative;
    margin: 0;
    padding: 0;
    width: 100%;
    height: calc(100vh - 260px)
}
</style>