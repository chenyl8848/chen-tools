<template>
    <a-card>
        <tool-header></tool-header>
        <canvas class="signaturepad-container" ref="signaturePadContainerRef" width="800" height="400">
        </canvas>
        <div class="operation-container">
            <a-space wrap>
                <a-button type="primary" @click="undo" :icon="h(UndoOutlined)">撤销</a-button>
                <a-button type="primary" @click="redo" :icon="h(RedoOutlined)">重做</a-button>
                <a-button type="primary" @click="clear" :icon="h(ClearOutlined)">清空</a-button>
                <!-- <a-button type="primary" @click="redraw" :icon="h(SearchOutlined)">重画</a-button> -->
                <a-popover placement="bottom">
                    <template #content>
                        <ChromePicker v-model="penColor"></ChromePicker>
                    </template>
                    <a-button type="primary" :icon="h(FontColorsOutlined)">画笔颜色</a-button>
                </a-popover>
                <a-popover placement="bottom">
                    <template #content>
                        <a-slider v-model:value="penSize" :min="1" :max="20" style="width: 200px;"
                            @change="changePenSize" />
                    </template>
                    <a-button type="primary" :icon="h(FontSizeOutlined)">画笔大小</a-button>
                </a-popover>
                <a-popover placement="bottom">
                    <template #content>
                        <CompactPicker v-model:tinyColor="backgroundColor"></CompactPicker>
                    </template>
                    <a-button type="primary" :icon="h(BgColorsOutlined)">背景颜色</a-button>
                </a-popover>
                <a-dropdown placement="bottom" :arrow="{ pointAtCenter: true }">
                    <a-button type="primary" :icon="h(SaveOutlined)">保存</a-button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item>
                                <a-button @click="save('png')">PNG</a-button>
                            </a-menu-item>
                            <a-menu-item>
                                <a-button @click="save('jpeg')">JPEG</a-button>
                            </a-menu-item>
                            <a-menu-item>
                                <a-button @click="save('svg')">SVG</a-button>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
                <a-button type="primary" @click="exportData" :icon="h(ExportOutlined)">导出</a-button>
                <a-upload v-model:file-list="fileList" :max-count="1" accept=".json" :showUploadList="false"
                    @change="importData">
                    <a-button type="primary" @click="importData" :icon="h(ImportOutlined)">导入</a-button>
                </a-upload>
                <a-button type="primary" @click="importDataURL" :icon="h(UploadOutlined)">上传</a-button>
            </a-space>
        </div>
    </a-card>
</template>

<script setup>
import { onMounted, ref, watch, h } from 'vue'
const signaturePadContainerRef = ref()
import SignaturePad from 'signature_pad'
import { downloadBase64Image, downloadJSONData } from '@/utils/common'
import { ChromePicker, CompactPicker, tinycolor } from 'vue-color'
import { UndoOutlined, RedoOutlined, ClearOutlined, FontColorsOutlined, FontSizeOutlined, BgColorsOutlined, SaveOutlined, ExportOutlined, ImportOutlined, UploadOutlined } from '@ant-design/icons-vue'

const signaturePad = ref()
let data = []
let dataURL = ''
let redoData = []

const penColor = defineModel({
    default: 'rgb(255, 55, 33)'
})

const backgroundColor = defineModel('backgroundColor', {
    default: tinycolor('#FFFFFF')
})

const penSize = ref(2)

const fileList = ref([])

const initSignature = () => {
    signaturePad.value = new SignaturePad(signaturePadContainerRef.value, {
        backgroundColor: backgroundColor.value,
        // backgroundColor: `rgb(${backgroundColor.value._r}, ${backgroundColor.value._g}, ${backgroundColor.value._b})`,
        penColor: penColor.value,
        minWidth: penSize.value,
        maxWidth: penSize.value
    })
}

const undo = () => {
    data = signaturePad.value.toData()
    redoData.push(data.pop())
    signaturePad.value.fromData(data)
}

const redo = () => {
    console.log(redoData)
    if (redoData.length > 0) {
        data.push(redoData.pop())
        signaturePad.value.fromData(data)
    }
}

const clear = () => {
    data = []
    redoData = []
    signaturePad.value.clear()
}

const redraw = () => {
    console.log('redraw')
    signaturePad.value.redraw()
}

watch(() => penColor.value, (newValue) => {
    signaturePad.value.penColor = newValue
})

const changePenSize = (value) => {
    signaturePad.value.minWidth = value
    signaturePad.value.maxWidth = value
}

watch(() => backgroundColor.value, (newValue) => {
    signaturePad.value.backgroundColor = `rgb(${newValue._r}, ${newValue._g}, ${newValue._b})`
    signaturePad.value.redraw()
})

const save = (type = 'png') => {
    let fileName = 'signature-'.concat(new Date().getTime()).concat('.').concat(type)
    console.log(type, fileName)

    switch (type) {
        case 'png':
            dataURL = signaturePad.value.toDataURL()
            break
        case 'jpeg':
            dataURL = signaturePad.value.toDataURL('image/jpeg')
            break
        case 'svg':
            dataURL = signaturePad.value.toDataURL('image/svg+xml')
            // dataURL = signaturePad.value.toSVG({ includeBackgroundColor: true, includeDataUrl: true })
            break
    }
    downloadBase64Image(dataURL, fileName)
}

const exportData = () => {
    data = signaturePad.value.toData()
    console.log('exportData', data)
    downloadJSONData(data)
}

const importData = () => {
    // signaturePad.value.fromData(data)
    // const jsonData = readFileData(fileList.value[0])
    console.log(data.values, fileList.value)
}

const importDataURL = () => {
    signaturePad.value.fromDataURL(dataURL)
}

onMounted(() => {
    initSignature()
})
</script>

<style lang="css" scoped>
.signaturepad-container {
    text-align: center;
    border: 1px solid;
    margin: 0 auto;
    display: block;
    margin-bottom: 20px;
    border-radius: 2%;
}

.operation-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>