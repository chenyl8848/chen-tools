<template>
    <a-card>
        <tool-header />
        <div id="vditor"></div>
    </a-card>
</template>
<script setup>
import { onMounted, ref, computed } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import emoji from '@/utils/emoji'

const vditor = ref(null)
const computedHeight = computed(() => `${window.innerHeight - 350}px`)

const initVditor = () => {
    vditor.value = new Vditor('vditor', {
        // height: '50vh',
        height: computedHeight.value,
        width: '100%',
        toolbarConfig: {
            pin: true,
        },
        cache: {
            enable: false,
        },
        after: () => {
            vditor.value.setValue('');
        },
        hint: {
            emoji
        },
        // 预览
        preview: {
            mode: 'both',
            hljs: {
                enable: true
            }
        },
    })
}

onMounted(() => {
    initVditor()
})
</script>

<style lang="css" scoped>
:deep(.vditor-emojis) {
    width: 1000px;
}
</style>