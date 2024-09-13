<template>
    <div>
        <a-button-group>
            <a-button size="small" @click="zoomIn">放大</a-button>
            <a-button size="small" @click="zoomOut">缩小</a-button>
            <a-button size="small" @click="zoomReset">大小适应</a-button>
            <a-button size="small" @click="translateReset">定位还原</a-button>
            <a-button size="small" @click="undo" :disabled="undoDisable">上一步(ctrl+z)</a-button>
            <a-button size="small" @click="redo" :disabled="redoDisable">下一步(ctrl+y)</a-button>
            <a-button size="small" @click="download">下载图片</a-button>
            <a-button type="primary" size="small" :disabled="submitDisable" @click="submit">提交</a-button>
        </a-button-group>
    </div>
</template>
<script setup>
import { onMounted, ref, reactive } from 'vue'

const $props = defineProps({
    logicFlow: Object || String,
    catTurboData: Boolean
})
const undoDisable = ref(true);
const redoDisable = ref(true);
const submitDisable = ref(true);

onMounted(() => {
    $props .logicFlow && $props .logicFlow.on('history:change', ({ data: { undoAble, redoAble } }) => {
        undoDisable.value = !undoAble;
        redoDisable.value = !redoAble;
        const graphData = $props .logicFlow.getGraphData()
        const nodes = graphData.nodes
        const hasStart = nodes.filter(k => k.flow_type === 'start').length > 0
        const hasEnd = nodes.filter(k => k.flow_type === 'end').length > 0
        submitDisable.value = !(hasStart && hasEnd)
    });
});

const zoomIn = () => {
    $props .logicFlow.zoom(true);
};

const zoomOut = () => {
    $props .logicFlow.zoom(false);
};

const zoomReset = () => {
    $props .logicFlow.resetZoom();
};

const translateReset = () => {
    $props .logicFlow.resetTranslate();
};

const reset = () => {
    $props .logicFlow.resetZoom();
    $props .logicFlow.resetTranslate();
};

const undo = () => {
    $props .logicFlow.undo();
};

const redo = () => {
    $props .logicFlow.redo();
};

const download = () => {
    $props .logicFlow.getSnapshot();
};

const catData = () => {
    emit('catData');
};

const catTurboData = () => {
    emit('catTurboData');
};

const showMiniMap = () => {
    const { lf } = props;
    lf.extension.miniMap.show(lf.graphModel.width - 150, 40)
};

const submit = () => {
   
}
</script>
<style scoped></style>