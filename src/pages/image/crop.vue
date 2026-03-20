<template>
    <a-card>
        <tool-header />
        <splitpanes>
            <pane size="75">
                <div class="crop-container">
                    <img :src="imageUrl" alt="待裁剪图片" ref="imageRef" />
                </div>
                <div class="control-panel mgt-20">
                    <a-space class="mgt-10" wrap>
                        <a-select v-model:value="aspectRatio" :options="cropOptions" style="width: 120px"
                            @change="updateAspectRatio" placeholder="选择比例">
                        </a-select>
                        <a-radio-group v-model:value="dragMode" button-style="solid" @change="updateDragMode">
                            <a-radio-button value="none">无</a-radio-button>
                            <a-radio-button value="crop">裁剪</a-radio-button>
                            <a-radio-button value="move">拖拽</a-radio-button>
                        </a-radio-group>
                        <a-tooltip title="上传" placement="bottom">
                            <a-upload v-model:file-list="fileList" list-type="picture" :show-upload-list="false"
                                :before-upload="beforeUpload" :disabled="loading">
                                <a-button type="primary" :loading="loading">
                                    <upload-outlined v-if="!loading" />
                                    <!-- {{ loading ? '上传中...' : '上传图片' }} -->
                                </a-button>
                            </a-upload>
                        </a-tooltip>
                        <a-tooltip title="放大" placement="bottom">
                            <a-button @click="zoomCrop(0.1)" type="text" :icon="h(ZoomInOutlined)" />
                        </a-tooltip>
                        <a-tooltip title="缩小" placement="bottom">
                            <a-button @click="zoomCrop(-0.1)" type="text" :icon="h(ZoomOutOutlined)" />
                        </a-tooltip>
                        <a-tooltip title="左移" placement="bottom">
                            <a-button @click="moveCrop(-10, 0)" type="text" :icon="h(ArrowLeftOutlined)" />
                        </a-tooltip>
                        <a-tooltip title="右移" placement="bottom">
                            <a-button @click="moveCrop(10, 0)" type="text" :icon="h(ArrowRightOutlined)" />
                        </a-tooltip>
                        <a-tooltip title="上移" placement="bottom">
                            <a-button @click="moveCrop(0, -10)" type="text" :icon="h(ArrowUpOutlined)" />
                        </a-tooltip>
                        <a-tooltip title="下移" placement="bottom">
                            <a-button @click="moveCrop(0, 10)" type="text" :icon="h(ArrowDownOutlined)" />
                        </a-tooltip>
                        <a-tooltip title="右旋45°" placement="bottom">
                            <a-button @click="rotateCrop(45)" type="text" :icon="h(RotateRightOutlined)" />
                        </a-tooltip>
                        <a-tooltip title="左旋45°" placement="bottom">
                            <a-button @click="rotateCrop(-45)" type="text" :icon="h(RotateLeftOutlined)" />
                        </a-tooltip>
                        <a-tooltip title="禁用" placement="bottom">
                            <a-button @click="disableCrop" type="text" :icon="h(LockOutlined)" />
                        </a-tooltip>
                        <a-tooltip title="启用" placement="bottom">
                            <a-button @click="enableCrop" type="text" :icon="h(UnlockOutlined)" />
                        </a-tooltip>
                        <a-tooltip title="重置" placement="bottom">
                            <a-button @click="resetCrop" type="text" :icon="h(ReloadOutlined)" />
                        </a-tooltip>
                        <a-tooltip title="下载" placement="bottom">
                            <a-button @click="download" type="primary" :icon="h(DownloadOutlined)" />
                        </a-tooltip>
                    </a-space>
                </div>
            </pane>
            <pane>
                <div class="preview-container">
                    <a-image :width="250" :src="previewImageUrl" :fallback="'/public/images/tools.png'" />
                </div>
            </pane>
        </splitpanes>
    </a-card>
</template>

<script setup>
import Cropper from 'cropperjs'
import { onMounted, onUnmounted, ref, h } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import { message } from 'ant-design-vue'
import 'splitpanes/dist/splitpanes.css'
import 'cropperjs/dist/cropper.css'
import { ZoomInOutlined, ZoomOutOutlined, ArrowLeftOutlined, ArrowRightOutlined, ArrowUpOutlined, ArrowDownOutlined, RotateRightOutlined, RotateLeftOutlined, LockOutlined, UnlockOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons-vue'

const imageUrl = ref('/public/images/tools.png')
const imageRef = ref()
const cropper = ref()
const previewImageUrl = ref('/public/images/tools.png')
const fileList = ref([])
// 默认1:1比例
const aspectRatio = ref(4 / 3)
const dragMode = ref('crop')
const loading = ref(false)
const cropOptions = ref([
    { label: '自由比例', value: 0 },
    { label: '1:1', value: 1 },
    { label: '3:2', value: 3 / 2 },
    { label: '4:3', value: 4 / 3 },
    { label: '16:9', value: 16 / 9 },
])

const initCropper = () => {
    if (cropper.value) {
        cropper.value.destroy()
    }
    cropper.value = new Cropper(imageRef.value, {
        viewMode: 1,
        aspectRatio: aspectRatio.value,
        dragMode: dragMode.value,
        guides: true,
        center: true,
        highlight: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: true,
        // 添加 crop 事件监听
        crop: (event) => {
            updatePreview()
        },
        ready: () => {
            // 初始化完成后立即更新一次预览
            updatePreview()
        }
    })
}
const updateAspectRatio = (value) => {
    aspectRatio.value = value
    if (cropper.value) {
        cropper.value.setAspectRatio(value)
    }
}

const updateDragMode = () => {
    if (cropper.value) {
        cropper.value.setDragMode(dragMode.value)
    }
}

const beforeUpload = (file) => {
    // 验证文件类型
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
        message.error('请上传图片文件！')
        return false
    }

    // 验证文件大小（5MB）
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
        message.error('图片大小不能超过5MB！')
        return false
    }

    loading.value = true
    const reader = new FileReader()
    reader.onload = (e) => {
        const base64String = e.target.result
        imageUrl.value = base64String
        console.log('base64String', base64String)

        // 重置预览图和裁剪状态
        previewImageUrl.value = base64String

        // 如果有cropper实例，替换图片源并重置裁剪框
        console.log('cropper', cropper.value)
        if (cropper.value) {
            cropper.value.replace(base64String)
            // cropper.value.reset()
        } else {
            // 如果没有实例，重新初始化
            initCropper()
        }

        loading.value = false
        message.success('图片上传成功！')
    }

    reader.onerror = () => {
        loading.value = false
        message.error('图片读取失败，请重试！')
    }

    reader.readAsDataURL(file)
    return false
}

const download = () => {
    try {
        const link = document.createElement('a')
        link.href = previewImageUrl.value
        const timestamp = new Date().getTime()
        link.download = `cropped-image-${timestamp}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        message.success('图片下载成功！')
    } catch (error) {
        console.error('保存错误:', error)
        message.error('图片保存失败，请重试！')
    }
}


const zoomCrop = (ratio) => {
    if (cropper.value) {
        cropper.value.zoom(ratio)
    }
}

const moveCrop = (x, y) => {
    if (cropper.value) {
        cropper.value.move(x, y)
    }
}

const rotateCrop = (degrees) => {
    if (cropper.value) {
        cropper.value.rotate(degrees)
    }
}

const disableCrop = () => {
    if (cropper.value) {
        cropper.value.disable()
    }
}

const enableCrop = () => {
    if (cropper.value) {
        cropper.value.enable()
    }
}

const resetCrop = () => {
    if (cropper.value) {
        cropper.value.reset()
        previewImageUrl.value = imageUrl.value
    }
}

const updatePreview = () => {
    if (!cropper.value) return

    try {
        const canvas = cropper.value.getCroppedCanvas({
            width: 800,
            height: 800,
            fillColor: '#fff',
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high'
        })

        if (canvas) {
            previewImageUrl.value = canvas.toDataURL('image/png')
        }
    } catch (error) {
        console.error('预览更新错误:', error)
    }
}

onMounted(() => {
    // 确保图片加载完成后再初始化cropper
    if (imageRef.value && imageRef.value.complete) {
        initCropper()
    } else {
        imageRef.value.onload = () => {
            initCropper()
        }
    }
})

onUnmounted(() => {
    if (cropper.value) {
        cropper.value.destroy()
        cropper.value = null
    }
})
</script>

<style lang="scss" scoped>
.crop-container {
    height: 450px;
    display: flex;
    align-items: center;
    // justify-content: center;
    border-radius: 8px;
    overflow: hidden;

    img {
        max-width: 100%;
        max-height: 100%;
        display: block;
    }

    :deep(.cropper-container) {
        max-width: 100%;
        max-height: 100%;
    }

    :deep(.cropper-modal) {
        opacity: 0.5;
    }
}

.control-panel {
    padding: 16px;
    // background-color: #fafafa;
    // border-radius: 8px;
    // border: 1px solid #f0f0f0;

    .control-section {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .control-label {
            margin-right: 12px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
            min-width: 80px;
        }
    }
}

.preview-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    overflow: hidden;
    min-height: 300px;
    margin-bottom: 12px;

    :deep(.ant-image) {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    :deep(.ant-image-img) {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
}
</style>