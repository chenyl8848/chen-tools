<template>
    <a-card>
        <p class="title">手绘白板</p>
        <a-spin :spinning="loading">
            <iframe src="https://chencoding.top:8081" class="whiteboardContainer" ref="iframeRef" frameborder="0"></iframe>
        </a-spin>
        <!-- <a-skeleton loading="loading" >
            </a-skeleton> -->
    </a-card>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const loading = ref(true)
const iframeRef = ref(null)

onMounted(() => {
    iframeRef.value.onload = () => {
        loading.value = false
    }
})

</script>

<style>
.title {
    font-size: 16px;
    font-weight: 600;
}

.whiteboardContainer {
    margin: 0;
    padding: 0;
    width: 100%;
    height: calc(100vh - 270px)
}
</style>