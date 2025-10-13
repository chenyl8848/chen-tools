<template>
    <a-card>
        <tool-header />
        <a-row>
            <a-col :span="9">
                <div class="image-container">
                    <a-upload v-model:file-list="fileList" name="avatar" :show-upload-list="false"
                        :before-upload="beforeUpload" accept=".png,.jpeg,.jpg,.webp,.svg,.ico">
                        <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="max-width: 100%;height: auto" />
                        <div v-else>
                            <div class="upload-container">
                                <!-- <plus-outlined></plus-outlined> -->
                                <CloudUploadOutlined style="font-size: 24px" />
                            </div>
                        </div>
                    </a-upload>
                </div>
            </a-col>
            <a-col :span="3" style="margin-top: 5%;">
                <a-space direction="vertical" size="large">
                    <a-button type="primary" :icon="h(ArrowLeftOutlined)" @click="convert">转换</a-button>
                    <a-button type="primary" :icon="h(CopyOutlined)" @click="copyText(imageBase64)">复制</a-button>
                    <a-button type="primary" danger :icon="h(ClearOutlined)" @click="clear">清空</a-button>
                </a-space>
            </a-col>
            <a-col :span="12">
                <a-textarea v-model:value="imageBase64" placeholder="请输入 Base64 字符串"
                    :auto-size="{ minRows: 15, maxRows: 18 }">
                </a-textarea>
            </a-col>
        </a-row>
    </a-card>
</template>

<script setup>
import { ref, h } from 'vue'
import { ArrowLeftOutlined, CopyOutlined, ClearOutlined } from '@ant-design/icons-vue'
import { copyText } from '@/utils/common'
import { message } from 'ant-design-vue'

const imageUrl = ref('')
const imageBase64 = ref('')

const fileList = ref([])
const beforeUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
            // 这里是Base64编码的字符串
            const base64String = e.target.result
            imageUrl.value = base64String
            imageBase64.value = base64String
        }
        reader.readAsDataURL(file)

        return false
    } else {
        message.error('请上传图片文件！')
        return false
    }
}

const convert = () => {
    imageUrl.value = imageBase64.value
}

const clear = () => {
    imageBase64.value = ''
}
</script>

<style lang="scss" scoped>
.image-container {
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    .upload-container {
        width: 320px;
        height: 200px;
        margin-inline-end: 8px;
        margin-bottom: 8px;
        text-align: center;
        vertical-align: top;
        background-color: rgba(0, 0, 0, 0.02);
        border: 1px dashed #d9d9d9;
        border-radius: 8px;
        cursor: pointer;
        transition: border-color 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>