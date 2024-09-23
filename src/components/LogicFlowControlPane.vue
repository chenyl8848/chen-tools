<template>
    <div>
        <a-button-group>
            <a-tooltip placement="bottom">
                <template #title>
                    <span>放大</span>
                </template>
                <a-button :icon="h(ZoomInOutlined)" @click="zoomIn" size="large" />
            </a-tooltip>
            <a-tooltip placement="bottom">
                <template #title>
                    <span>缩小</span>
                </template>
                <a-button :icon="h(ZoomOutOutlined)" @click="zoomOut" size="large" />
            </a-tooltip>
            <a-tooltip placement="bottom">
                <template #title>
                    <span>大小适应</span>
                </template>
                <a-button :icon="h(FullscreenOutlined)" @click="zoomReset" size="large" />
            </a-tooltip>
            <a-tooltip placement="bottom">
                <template #title>
                    <span>定位还原</span>
                </template>
                <a-button :icon="h(FullscreenExitOutlined)" @click="translateReset" size="large" />
            </a-tooltip>
            <a-tooltip placement="bottom">
                <template #title>
                    <span>上一步(Ctrl + Z)</span>
                </template>
                <a-button :icon="h(ArrowLeftOutlined)" @click="undo" size="large" />
            </a-tooltip>
            <a-tooltip placement="bottom">
                <template #title>
                    <span>下一步(Ctrl + Y)</span>
                </template>
                <a-button :icon="h(ArrowRightOutlined)" @click="redo" size="large" />
            </a-tooltip>
            <a-tooltip placement="bottom">
                <template #title>
                    <span>小地图</span>
                </template>
                <a-button :icon="h(HeatMapOutlined)" @click="showMiniMap" size="large" />
            </a-tooltip>
            <a-tooltip placement="bottom">
                <template #title>
                    <span>边动画</span>
                </template>
                <a-button :icon="h(PlayCircleOutlined)" @click="showEdgeAnimation" size="large"
                    v-if="!isOpenEdgeAnimation" />
                <a-button :icon="h(PauseCircleOutlined)" @click="showEdgeAnimation" size="large" v-else />
            </a-tooltip>
            <a-tooltip placement="bottom">
                <template #title>
                    <span>下载图片</span>
                </template>
                <a-button :icon="h(DownloadOutlined)" @click="download" size="large" />
            </a-tooltip>
            <a-tooltip placement="bottom">
                <template #title>
                    <span>cmd + c 或 ctrl + c 复制节点</span><br />
                    <span>cmd + v 或 ctrl + v 粘贴节点</span><br />
                    <span>cmd + z 或 ctrl + z 撤销操作</span><br />
                    <span>cmd + y 或 ctrl + y 回退操作</span><br />
                    <span>shift 批量选中</span><br />
                    <span>backspace 删除操作</span><br />
                </template>
                <a-button :icon="h(QuestionCircleOutlined)" size="large" />
            </a-tooltip>
        </a-button-group>
    </div>
</template>
<script setup>
import { h } from 'vue'
import { ZoomInOutlined, ZoomOutOutlined, FullscreenOutlined, FullscreenExitOutlined, ArrowLeftOutlined, ArrowRightOutlined, HeatMapOutlined, PlayCircleOutlined, PauseCircleOutlined, DownloadOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'

const $props = defineProps({
    logicFlow: Object
})

// onMounted(() => {
//     $props.logicFlow && $props.logicFlow.on('history:change', ({ data: { undoAble, redoAble } }) => {
//         console.log(undoAble, redoAble, "ableeeeeeeeeeeeeeeeeeeeeeeee")
//         const graphData = $props.logicFlow.getGraphData()
//         const nodes = graphData.nodes
//         console.log(nodes, graphData, "graphhhhhhhhhhhhhhhh")
//     })
// })

// 放大
const zoomIn = () => {
    $props.logicFlow.zoom(true)
}

// 缩小
const zoomOut = () => {
    $props.logicFlow.zoom(false)
}

// 大小适应
const zoomReset = () => {
    $props.logicFlow.resetZoom()
}

// 定位还原
const translateReset = () => {
    $props.logicFlow.resetTranslate()
}

// 上一步
const undo = () => {
    $props.logicFlow.undo()
}

// 下一步
const redo = () => {
    $props.logicFlow.redo()
}

// 小地图
let isShowMiniMap = false
const showMiniMap = () => {
    const { logicFlow } = $props
    if (!isShowMiniMap) {
        // logicFlow.extension.miniMap.show(logicFlow.graphModel.width - 150, 40)
        logicFlow.extension.miniMap.show()
        isShowMiniMap = true
    } else {
        logicFlow.extension.miniMap.hide()
        isShowMiniMap = false
    }
}

// 边动画
let isOpenEdgeAnimation = false
const showEdgeAnimation = () => {
    const { logicFlow } = $props
    const { edges } = logicFlow.getGraphRawData()

    if (edges && edges.length > 0) {
        if (!isOpenEdgeAnimation) {
            edges.forEach((edge) => {
                logicFlow.openEdgeAnimation(edge.id)
            })
        } else {
            edges.forEach((edge) => {
                logicFlow.closeEdgeAnimation(edge.id)
            })
        }
        isOpenEdgeAnimation = !isOpenEdgeAnimation
    }
}

// 下载
const download = () => {
    $props.logicFlow.getSnapshot()
}

</script>
<style scoped></style>