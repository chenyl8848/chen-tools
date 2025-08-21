<template>
    <a-card>
        <tool-title :title="'时间戳转换'" :description="'时间戳转换'"></tool-title>
        <a-row>
            <a-col :span="6">
                <a-form-item label="当前时间" class="mgr-20">
                    <a-input v-model:value="timestamp">
                        <template #prefix>
                            <a-tooltip title="开始">
                                <PlayCircleOutlined @click="resume" v-show="!isActive" />
                            </a-tooltip>
                            <a-tooltip title="停止">
                                <PauseCircleOutlined @click="pause" v-show="isActive" />
                            </a-tooltip>
                        </template>
                        <template #suffix>
                            <CopyOutlined @click="copyText(timestamp)" />
                        </template>
                    </a-input>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="6" class="mgr-20">
                <a-form-item label="时间戳">
                    <a-input v-model:value="calculateTimestamp" allowClear />
                </a-form-item>
            </a-col>
            <a-col :span="1" class="mgr-20">
                <a-button @click="timestamp2Date">转换</a-button>
            </a-col>
            <a-col :span="6" class="mgr-20">
                <a-form-item label="时间">
                    <a-input v-model:value="toDate" readOnly >
                        <template #suffix>
                            <CopyOutlined @click="copyText(toDate)" />
                        </template>
                    </a-input>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="6" class="mgr-20">
                <a-form-item label="时间">
                    <a-date-picker show-time placeholder="Select Time" v-model:value="calculateDate"
                        style="width: 100%;" :locale="locale" />
                </a-form-item>
            </a-col>
            <a-col :span="1" class="mgr-20">
                <a-button @click="date2Timestamp">转换</a-button>
            </a-col>
            <a-col :span="6" class="mgr-20">
                <a-form-item label="时间戳">
                    <a-input v-model:value="toTimestamp" readOnly >
                         <template #suffix>
                            <CopyOutlined @click="copyText(toTimestamp)" />
                        </template>
                    </a-input>
                </a-form-item>
            </a-col>
        </a-row>
    </a-card>
</template>

<script setup>
import { ref } from 'vue'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import dayjs from 'dayjs'
import { useTimestamp, useDateFormat, useNow } from '@vueuse/core'
const { timestamp, pause, resume, isActive } = useTimestamp({ controls: true })
import { copyText } from '@/utils/common'

const calculateTimestamp = ref()
calculateTimestamp.value = useNow().value.getTime()

const toDate = ref('')
const timestamp2Date = () => {
    toDate.value = useDateFormat(new Date(Number(calculateTimestamp.value)), 'YYYY-MM-DD HH:mm:ss', { locales: 'zh-CH' }).value
}

const calculateDate = ref()
calculateDate.value = dayjs(useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss', { locales: 'zh-CH' }).value, 'YYYY-MM-DD HH:mm:ss')
const toTimestamp = ref('')
const date2Timestamp = () => {
    toTimestamp.value = new Date(calculateDate.value).getTime()
}
</script>