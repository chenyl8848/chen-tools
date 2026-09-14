<template>
    <a-card>
        <tool-header />
        <a-row :gutter="20">
            <a-col :span="8">
                <a-form-item label="字符串长度">
                    <a-input-number v-model:value="length" :min="1" :max="1024" style="width: 100%;" />
                </a-form-item>
                <a-form-item label="生成数量">
                    <a-input-number v-model:value="count" :min="1" :max="100" style="width: 100%;" />
                </a-form-item>
                <a-form-item label="包含字符">
                    <a-space direction="vertical">
                        <a-checkbox v-model:checked="useLower">小写字母 (a-z)</a-checkbox>
                        <a-checkbox v-model:checked="useUpper">大写字母 (A-Z)</a-checkbox>
                        <a-checkbox v-model:checked="useNumber">数字 (0-9)</a-checkbox>
                        <a-checkbox v-model:checked="useSymbol">特殊符号</a-checkbox>
                    </a-space>
                </a-form-item>
                <a-button type="primary" block @click="generate">生成</a-button>
            </a-col>
            <a-col :span="16">
                <a-form-item label="生成结果">
                    <a-textarea v-model:value="result" :auto-size="{ minRows: 12, maxRows: 18 }" readOnly />
                </a-form-item>
                <a-space>
                    <a-button @click="copyText(result)">复制</a-button>
                    <a-button type="primary" danger @click="clear">清空</a-button>
                </a-space>
            </a-col>
        </a-row>
    </a-card>
</template>

<script setup>
import { ref } from 'vue'
import { copyText } from '@/utils/common'
import { message } from 'ant-design-vue'

const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBER = '0123456789'
const SYMBOL = '!@#$%^&*()-_=+[]{};:,.<>?'

const length = ref(16)
const count = ref(1)
const useLower = ref(true)
const useUpper = ref(true)
const useNumber = ref(true)
const useSymbol = ref(false)
const result = ref('')

const buildCharset = () => {
    let charset = ''
    if (useLower.value) charset += LOWER
    if (useUpper.value) charset += UPPER
    if (useNumber.value) charset += NUMBER
    if (useSymbol.value) charset += SYMBOL
    return charset
}

// 使用 Web Crypto 生成随机字符，并用拒绝采样消除取模偏差
const randomString = (charset, len) => {
    const max = Math.floor(256 / charset.length) * charset.length
    const bytes = new Uint8Array(len * 2)
    let str = ''
    while (str.length < len) {
        crypto.getRandomValues(bytes)
        for (let i = 0; i < bytes.length && str.length < len; i++) {
            if (bytes[i] < max) {
                str += charset[bytes[i] % charset.length]
            }
        }
    }
    return str
}

const generate = () => {
    const charset = buildCharset()
    if (!charset) {
        message.warning('请至少选择一种字符类型')
        return
    }
    if (!length.value || length.value < 1) {
        message.warning('请输入有效的字符串长度')
        return
    }
    const lines = []
    for (let i = 0; i < count.value; i++) {
        lines.push(randomString(charset, length.value))
    }
    result.value = lines.join('\n')
}

const clear = () => {
    result.value = ''
}
</script>
