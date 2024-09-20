<template>
    <a-card>
        <p class="title">手绘白板</p>
        <iframe src="https://chencoding.top:8081" class="whiteboardContainer"></iframe>
    </a-card>
</template>

<script setup>

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
    height: calc(100vh - 260px)
}
</style>