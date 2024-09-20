<template>
    <a-card>
        <p class="title">流程图</p>
        <div class="logicFlowContainer" ref="logicFlowContainerRef">
        </div>
        <div class="left-fixed-menu">
            <a-card>
                <logic-flow-node-pane :logicFlow="logicFlow"></logic-flow-node-pane>
            </a-card>
        </div>
        <div class="top-fixed-menu">
            <a-card>
                <logic-flow-control-pane :logicFlow="logicFlow"></logic-flow-control-pane>
            </a-card>
        </div>
    </a-card>
</template>

<script setup>
import LogicFlowNodePane from "@/components/LogicFlowNodePane.vue"
import LogicFlowControlPane from "@/components/LogicFlowControlPane.vue"
import LogicFlow from "@logicflow/core"
import { Menu, MiniMap, Snapshot } from '@logicflow/extension'
import "@logicflow/core/lib/style/index.css"
import "@logicflow/extension/lib/style/index.css"
import { onMounted, ref } from "vue"

const logicFlowContainerRef = ref()
let logicFlow = ref(null)


const initLogicFlow = () => {
    LogicFlow.use(Menu)
    LogicFlow.use(MiniMap)
    LogicFlow.use(Snapshot)

    logicFlow.value = new LogicFlow({
        container: logicFlowContainerRef.value,
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

    logicFlow.value.render()
}

onMounted(() => {
    initLogicFlow()
})

</script>

<style lang="scss">
.title {
    font-size: 16px;
    font-weight: 600;
}

.logicFlowContainer {
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