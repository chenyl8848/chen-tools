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
import { message } from 'ant-design-vue'

const input = ref('')
const result = ref('')

const encode = () => {
    try {
        result.value = encodeURIComponent(input.value)
    } catch (error) {
        message.error('编码失败：输入内容包含无效字符')
        console.error('URL编码错误:', error)
        result.value = ''
    }
}

const decode = () => {
    try {
        result.value = decodeURIComponent(input.value)
    } catch (error) {
        message.error('解码失败：输入内容不是有效的URL编码')
        console.error('URL解码错误:', error)
        result.value = ''
    }
}

const clear = () => {
    input.value = ''
}
</script>