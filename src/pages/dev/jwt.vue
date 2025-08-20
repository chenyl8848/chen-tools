<template>
    <a-card>
        <tool-title :title="'JWT 生成解析'" :description="'生成和解析 JSON Web Token（jwt）并显示其内容。'"></tool-title>
        <a-row class="mgb-20">
            <a-col :span="8">
                <a-form-item label="Header/头部" class="mgr-20">
                    <a-textarea v-model:value="formatHeader" @input="handleInputHeader" placeholder="请输入Header/头部"
                        :auto-size="{ minRows: 5, maxRows: 10 }" allowClear />
                </a-form-item>
            </a-col>
            <a-col :span="8">
                <a-form-item label="Payload/载荷" class="mgr-20">
                    <a-textarea v-model:value="formatPayload" @input="handleInputPayload" placeholder="请输入Payload/载荷"
                        :auto-size="{ minRows: 5, maxRows: 10 }" allowClear />
                </a-form-item>
            </a-col>
            <a-col :span="8">
                <a-form-item label="Secret/密钥">
                    <a-textarea v-model:value="secret" placeholder="请输入Secret/密钥"
                        :auto-size="{ minRows: 5, maxRows: 10 }" allowClear />
                </a-form-item>
            </a-col>
        </a-row>
        <a-row class="mgb-20">
            <a-col :span="24">
                <a-space wrap>
                    <a-button type="primary" @click="generate">生成</a-button>
                    <a-button @click="parse">解析</a-button>
                    <a-button type="text" @click="copyText(token)">复制</a-button>
                    <a-button type="primary" danger @click="clear">清空</a-button>
                </a-space>
            </a-col>
        </a-row>
        <a-row class="mgb-20">
            <a-col :span="24">
                <a-textarea v-model:value="token" :auto-size="{ minRows: 5, maxRows: 10 }" />
            </a-col>
        </a-row>
    </a-card>
</template>

<script setup>
import jwt from '@/utils/jwt'
import { computed, ref } from 'vue'
import { copyText } from '@/utils/common'

const header = ref(
    JSON.stringify({ "alg": "HS256", "typ": "JWT" })
)
const formatHeader = computed(() => {
    // 第三个参数为缩进空格数，美化输出
    try {
        return JSON.stringify(JSON.parse(header.value), null, 2)
    } catch (error) {
        return header.value
    }
})
const handleInputHeader = (event) => {
    header.value = event.target.value
}

const iat = new Date().getTime()
const exp = iat + 60 * 60 * 1000
const payload = ref(JSON.stringify({
    'username': 'Java陈序员',
    'iat': iat,
    'exp': exp,
}))
const formatPayload = computed(() => {
    // 第三个参数为缩进空格数，美化输出
    try {
        return JSON.stringify(JSON.parse(payload.value), null, 2)
    } catch (error) {
        return payload.value
    }
})
const handleInputPayload = (event) => {
    payload.value = event.target.value
}

const secret = ref('拳打南山敬老院，脚踢北海幼儿园。')
const token = ref('')

token.value = jwt.generateToken(secret.value, header.value, payload.value)

const generate = () => {
    token.value = jwt.generateToken(secret.value, header.value, payload.value)
}

const parse = () => {
    const { parseHeader, parsePayload } = jwt.parseToken(token.value)
    header.value = parseHeader
    payload.value = parsePayload
}

const clear = () => {
    token.value = ''
}
</script>