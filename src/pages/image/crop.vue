<template>
    <a-card>
        <tool-header />
        <splitpanes>
            <pane size="50">
                <div class="crop-container">
                    <img :src="imageUrl" alt="avatar" ref="imageRef" />
                </div>
                <a-space class="mgt-20">
                    <a-upload v-model:file-list="fileList" list-type="picture" :show-upload-list="false"
                        :before-upload="beforeUpload">
                        <a-button>
                            <upload-outlined></upload-outlined>
                            上传
                        </a-button>
                    </a-upload>
                    <a-button @click="crop">裁剪</a-button>
                    <a-button @click="save">保存</a-button>
                </a-space>
            </pane>
            <pane>
                <div class="preview-container">
                    <a-image :width="400" :src="previewImageUrl" />
                </div>
            </pane>
        </splitpanes>
    </a-card>
</template>

<script setup>
import Cropper from 'cropperjs'
import { onMounted, ref, watch } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

const imageUrl = ref('/public/images/tools.png')
const imageRef = ref()
const cropper = ref()
const previewImageUrl = ref('/public/images/tools.png')
const fileList = ref([])

const initCropper = () => {

    // const image = new Image()

    // // image.src = '/public/images/tools.png'
    // image.src = imageUrl.value
    // image.alt = 'Picture'

    // cropper.value = new Cropper('#image')
    cropper.value = new Cropper(imageRef.value)
    // cropper.value = new Cropper(image, {
    //     container: '.left',
    // })

    // eslint-disable-next-line no-console
    console.log(cropper)

    console.log(cropper.value, 'result', cropper.value.getCropperImage())
}

const beforeUpload = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
        // 这里是Base64编码的字符串
        const base64String = e.target.result
        imageUrl.value = base64String
        previewImageUrl.value = base64String
        cropper.value.getCropperImage().src = base64String
    }
    reader.readAsDataURL(file)

    return false
}

const crop = async () => {
    const result = await cropper.value.getCropperSelection().$toCanvas()

    console.log(result)

    const base64Image = result.toDataURL('image/jpeg')

    previewImageUrl.value = base64Image
}

const save = async () => {
    // const result = await cropper.value.getCropperSelection().$toCanvas()

    // console.log(result)

    // const base64Image = result.toDataURL('image/jpeg')

    // // 打印
    // console.log(base64Image)
    // 设置预览图像的 src
    // preview.src = base64Image
    // 点击下载
    const link = document.createElement('a')
    link.href = previewImageUrl.value
    // link.download = 'cropped-image.jpg'
    link.download = `cropp-${new Date().getTime()}.png`
    link.click()
}

onMounted(() => {
    initCropper()
})
</script>

<style lang="scss" scoped>
.crop-container {
    :deep(cropper-canvas) {
        height: 360px;
        // height: calc(100vh - 260px);
    }
}

.preview-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 360px;
    // height: calc(100vh - 260px);
}
</style>