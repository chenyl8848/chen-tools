<template>
    <a-card>
        <tool-header />
        <a-form :model="options" :label-col="{ style: { width: '70px', marginRight: '12px' } }" style="width: 100%;">
            <a-row>
                <a-form-item label="中文汉字">
                    <a-textarea v-model:value="options.text" placeholder="请输入中文汉字"
                        :auto-size="{ minRows: 4, maxRows: 8 }">
                    </a-textarea>
                </a-form-item>
            </a-row>
            <a-row>
                <a-form-item label="拼音模式">
                    <a-radio-group v-model:value="options.mode" :options="modeOptions" @change="handleModeChange" />
                </a-form-item>
            </a-row>
            <a-row>
                <a-form-item label="拼音格式">
                    <a-radio-group v-model:value="options.style" :options="styleOptions" @change="handleStyleChange" />
                </a-form-item>
            </a-row>
            <a-row>
                <a-form-item label="其他选项">
                    <a-row>
                        <a-col :span="8">
                            <a-checkbox v-model:checked="options.group">词语分组</a-checkbox>
                        </a-col>
                        <a-col :span="8">
                            <a-checkbox v-model:checked="options.heteronym">输出多音字</a-checkbox>
                        </a-col>
                        <a-col :span="8">
                            <a-checkbox v-model:checked="options.compact">输出紧凑格式</a-checkbox>
                        </a-col>
                    </a-row>
                </a-form-item>
            </a-row>
            <a-row>
                <a-form-item label="拼音输出">
                    <a-textarea v-model:value="options.pinyin" placeholder="" :auto-size="{ minRows: 4, maxRows: 8 }"
                        readonly>
                    </a-textarea>
                </a-form-item>
            </a-row>

        </a-form>
    </a-card>
</template>

<script setup>
import pinyin from 'pinyin'
import { onMounted, reactive, watch } from 'vue'

const options = reactive({
    text: '中文汉字',
    mode: 'normal',
    style: 'normal',
    group: false,
    heteronym: false,
    compact: false,
    pinyin: ''
})

const modeOptions = [
    { label: '普通模式', value: 'normal' },
    { label: '姓氏模式', value: 'surname' },
]

const styleOptions = [
    { label: '普通风格', value: 'normal' },
    { label: '声调风格', value: 'tone' },
    { label: '音标风格(tone2)', value: 'tone2' },
    { label: '音标风格(to3ne)', value: 'to3ne' },
    { label: '声母风格', value: 'initials' },
    { label: '首字母风格', value: 'first_letter' },
    { label: '护照风格', value: 'passport' },
]

const initPinyin = () => {
    const result = pinyin(options.text, {
        style: options.style,
        mode: options.mode,
        group: options.group,
        heteronym: options.heteronym,
        compact: options.compact,
    })

    if (options.compact) {
        options.pinyin = result.join()
    } else {
        options.pinyin = result.join(' ')
    }
}

const handleModeChange = () => {
    initPinyin()
}

const handleStyleChange = () => {
    initPinyin()
}

watch(() => options, (newValue) => {
    initPinyin()
}, { deep: true })

onMounted(() => {
    initPinyin()
})
</script>

<style lang="css" scoped>
:deep(.ant-form-item) {
    width: 75%;
}
</style>