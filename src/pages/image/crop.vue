<template>
    <a-card>
        <tool-header />
        <div class="cropper-container">
            <div class="left">
                <img :src="imageUrl" alt="avatar" ref="imageRef" />
                <!-- <a-upload v-model:file-list="fileList" name="avatar" list-type="picture-card"
                    :show-upload-list="false"
                    :before-upload="beforeUpload">
                </a-upload> -->
                <a-upload v-model:file-list="fileList" list-type="picture" :show-upload-list="false"
                    :before-upload="beforeUpload">
                    <a-button>
                        <upload-outlined></upload-outlined>
                        上传
                    </a-button>
                </a-upload>
            </div>
            <div class="right">
                <a-image :width="200" :src="previewImageUrl" />
            </div>
        </div>
        <a-button @click="crop">裁剪</a-button>
        <a-button @click="save">保存</a-button>
    </a-card>
</template>

<script setup>
import Cropper from 'cropperjs'
import { onMounted, ref, watch } from 'vue'

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
    link.download = 'cropped-image.jpg'
    link.click()
}

onMounted(() => {
    initCropper()
})
</script>

<style lang="scss" scoped>
.cropper-container {
    display: flex;
    // justify-content: center;
    // align-items: center;

    .left {
        flex: 1;
        border: 1px solid var(--vp-c-divider);
        border-radius: 0.375rem;
        margin-bottom: 1rem;
        margin-top: 1rem;
        padding: 1.25rem 1.5rem;

        :deep(cropper-canvas) {
            height: 360px;
        }
    }

    .right {
        flex: 1;
    }
}
</style>