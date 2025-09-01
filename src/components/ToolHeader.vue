<template>
    <a-divider orientation="left">
        {{ title }}
    </a-divider>
    <a-descriptions :title="description" layout="vertical">
    </a-descriptions>
</template>

<script setup>
import { useTool } from '@/hook/global'
const { title, description } = useTool()

// defineProps(['title', 'description'])
</script>

<style lang="scss">
.ant-divider-inner-text {
    font-size: $toolTitleFontSize;
    font-weight: $toolTitleFontWeight;
}

:where(.css-dev-only-do-not-override-1p3hq3p).ant-descriptions .ant-descriptions-title {
    font-size: $toolDescriptionFontSize;
    font-weight: $toolDescriptionFontWeight;
}
</style>