<template>
    <a-card>
        <p>思维导图</p>
        <div class="mindMapContainer" ref="mindMapContainerRef"></div>
    </a-card>
</template>

<script setup>
import MindMap from "simple-mind-map"
import { onMounted, ref } from "vue"

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


const initMindMap = () => {
    const mindMap = new MindMap({
        el: mindMapContainerRef.value,
        data: mindMapData
    })
}

onMounted(() => {
    initMindMap()
})
</script>

<style lang="scss">
.mindMapContainer {
    margin: 0;
    padding: 0;
    width: 100%;
    height: calc(100vh - 320px)
}
</style>