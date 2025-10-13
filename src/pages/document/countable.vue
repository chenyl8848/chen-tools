<template>
    <a-card>
        <tool-header></tool-header>
        <a-textarea v-model:value="text" placeholder="请输入文本内容" :auto-size="{ minRows: 12, maxRows: 15 }" allowClear
            id="text">
        </a-textarea>
        <a-row :gutter="16" class="mgt-20">
            <a-col :span="4">
                <a-statistic title="段落" :value="counter.paragraphs" style="margin-right: 50px">
                    <template #prefix>
                        <AreaChartOutlined />
                    </template>
                </a-statistic>
            </a-col>
            <a-col :span="4">
                <a-statistic title="句子" :value="counter.sentences" class="demo-class">
                    <template #prefix>
                        <PieChartOutlined />
                    </template>
                </a-statistic>
            </a-col>
            <a-col :span="4">
                <a-statistic title="单词" :value="counter.words" style="margin-right: 50px">
                    <template #prefix>
                        <BarChartOutlined />
                    </template>
                </a-statistic>
            </a-col>
            <a-col :span="4">
                <a-statistic title="字符" :value="counter.characters" class="demo-class">
                    <template #prefix>
                        <DotChartOutlined />
                    </template>
                </a-statistic>
            </a-col>
            <a-col :span="4">
                <a-statistic title="合计" :value="counter.all" class="demo-class">
                    <template #prefix>
                        <LineChartOutlined />
                    </template>
                </a-statistic>
            </a-col>
        </a-row>
    </a-card>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import Countable from 'countable'
import { reactive } from 'vue'

const text = ref('')
let counter = reactive({
    paragraphs: 0,
    sentences: 0,
    words: 0,
    characters: 0,
    all: 0,
})

const initCounter = () => {
    Countable.count(document.getElementById('text'), tempCounter => {
        counter = tempCounter
    })
}

watch(() => text.value, (newValue, oldValue) => {
    initCounter()
})

onMounted(() => {
    initCounter()
})

</script>

<style lang="scss" scoped>
:deep(.ant-statistic-title) {
    font-size: 18px;
    font-weight: 700;
    color: black;
}
</style>
