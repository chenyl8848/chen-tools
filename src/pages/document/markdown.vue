<template>
    <a-card>
        <tool-title :title="'富文本编辑器'" :description="'富文本编辑器'"></tool-title>
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

onMounted(() => {
    vditor.value = new Vditor('vditor', {
        // height: '50vh',
        height: computedHeight.value,
        // width: '100%',
        toolbarConfig: {
            pin: true,
        },
        cache: {
            enable: false,
        },
        after: () => {
            vditor.value.setValue('hello, Vditor + Vue!');
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
})
</script>

<style lang="css" scoped>
:deep(.vditor-emojis) {
    width: 1000px;
}
</style>