<template>
    <a-card>
        <tool-header />
        <a-row class="mgb-20">
            <a-col :span="24">
                <a-textarea v-model:value="input" :auto-size="{ minRows: 5, maxRows: 10 }" allowClear />
            </a-col>
        </a-row>
        <a-row class="mgb-20">
            <a-col :span="24">
                <a-space wrap>
                    <a-button type="primary" @click="encode">编码</a-button>
                    <a-button @click="decode">解码</a-button>
                    <a-button type="text" @click="copyText(result)">复制</a-button>
                    <a-button type="primary" danger @click="clear">清空</a-button>
                </a-space>
            </a-col>
        </a-row>
        <a-row class="mgb-20">
            <a-col :span="24">
                <a-textarea v-model:value="result" :auto-size="{ minRows: 5, maxRows: 10 }" readOnly />
            </a-col>
        </a-row>
    </a-card>
</template>

<script setup>
import { ref } from 'vue'
import { copyText } from '@/utils/common'

const input = ref('')
const result = ref('')

const encode = () => {
    result.value = encodeURIComponent(input.value)
}

const decode = () => {
    result.value = decodeURIComponent(input.value)
}

const clear = () => {
    input.value = ''
}
</script>