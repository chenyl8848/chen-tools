<template>
    <a-card>
        <tool-header />
        <splitpanes>
            <pane size="50">
                <a-form :model="options" :label-col="{ style: { width: '70px', marginRight: '12px' } }">
                    <a-form-item label="内容">
                        <!-- <a-input v-model:value="options.data" placeholder="input placeholder" allowClear /> -->
                        <a-textarea v-model:value="options.data" :auto-size="{ minRows: 4, maxRows: 4 }"
                            placeholder="请输入内容" allowClear />
                    </a-form-item>
                    <a-form-item label="大小">
                        <a-slider v-model:value="options.cellSize" :min="1" :max="30" />
                    </a-form-item>
                    <a-form-item label="填充">
                        <a-slider v-model:value="options.padding" :min="1" :max="30" />
                    </a-form-item>
                    <a-form-item label="colorFore">
                        <!-- <SliderPicker v-model="colorFore"></SliderPicker> -->
                        <a-popover>
                            <template #content>
                                <SketchPicker v-model="colorFore"></SketchPicker>
                            </template>
                            <a-button :style="{ width: '50%', backgroundColor: colorFore }"></a-button>
                        </a-popover>
                    </a-form-item>
                    <a-form-item label="colorOut">
                        <!-- <SliderPicker v-model="colorOut"></SliderPicker> -->
                        <a-popover>
                            <template #content>
                                <SketchPicker v-model="colorOut"></SketchPicker>
                            </template>
                            <a-button :style="{ width: '50%', backgroundColor: colorOut }"></a-button>
                        </a-popover>
                    </a-form-item>
                    <a-form-item label="colorIn">
                        <!-- <SliderPicker v-model="colorIn"></SliderPicker> -->
                        <a-popover>
                            <template #content>
                                <SketchPicker v-model="colorIn"></SketchPicker>
                            </template>
                            <a-button :style="{ width: '50%', backgroundColor: colorIn }"></a-button>
                        </a-popover>
                    </a-form-item>
                    <a-form-item label="背景颜色">
                        <!-- <SliderPicker v-model="options.background"></SliderPicker> -->
                        <a-popover>
                            <template #content>
                                <SketchPicker v-model="options.background"></SketchPicker>
                            </template>
                            <a-button :style="{ width: '50%', backgroundColor: options.background }"></a-button>
                        </a-popover>
                    </a-form-item>
                    <a-form-item label="Logo">
                        <a-switch v-model:checked="checked" @change="addLogo" />
                    </a-form-item>
                    <a-tabs v-model="activeKey" v-show="checked" @change="changeLogo">
                        <a-tab-pane key="img" tab="图片">
                            <a-upload v-model:file-list="fileList" name="avatar" list-type="picture-card"
                                :show-upload-list="false" :before-upload="beforeUpload">
                                <!-- <img :src="imageUrl" alt="avatar" /> -->
                                <a-image :width="200" :src="imageUrl" :preview="false" />
                            </a-upload>
                        </a-tab-pane>
                        <a-tab-pane key="text" tab="文字">
                            <a-form-item label="文案">
                                <a-input v-model:value="textLogo.text" placeholder="请输入文案" allowClear />
                            </a-form-item>
                            <a-form-item label="字体大小">
                                <a-slider v-model:value="textLogo.options.fontSize" :min="10" :max="300" />
                            </a-form-item>
                            <a-form-item label="填充大小">
                                <a-slider v-model:value="textLogo.options.pad" :min="10" :max="100" />
                            </a-form-item>
                            <a-form-item label="字体颜色">
                                <!-- <SliderPicker v-model="textLogo.options.color"></SliderPicker> -->
                                <a-popover>
                                    <template #content>
                                        <SketchPicker v-model="textLogo.options.color"></SketchPicker>
                                    </template>
                                    <a-button
                                        :style="{ width: '50%', backgroundColor: textLogo.options.color }"></a-button>
                                </a-popover>
                            </a-form-item>
                            <a-form-item label="背景颜色">
                                <!-- <SliderPicker v-model="textLogo.options.padColor"></SliderPicker> -->
                                <a-popover>
                                    <template #content>
                                        <SketchPicker v-model="textLogo.options.padColor"></SketchPicker>
                                    </template>
                                    <a-button
                                        :style="{ width: '50%', backgroundColor: textLogo.options.padColor }"></a-button>
                                </a-popover>
                            </a-form-item>
                        </a-tab-pane>
                    </a-tabs>
                </a-form>
            </pane>
            <pane size="50">
                <div class="qr-container">
                    <QRCanvas :options="options" id="qr-canvans"></QRCanvas>
                    <a-button type="primary" :icon="h(SaveOutlined)" @click="save" class="mgt-20">保存</a-button>
                </div>
            </pane>
        </splitpanes>
    </a-card>
</template>

<script setup>
import { ref, h } from 'vue'
import { QRCanvas } from 'qrcanvas-vue'
import { SketchPicker, SliderPicker } from 'vue-color'
import { SaveOutlined } from '@ant-design/icons-vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

const colorFore = ref('black')
const colorOut = ref('black')
const colorIn = ref('black')
const options = ref({
    data: 'https://chencoding.top:8090/#/',
    cellSize: 10,
    padding: 10,
    // "L" | "M" | "Q" | "H"
    correctLevel: 'H',
    // 背景颜色
    background: 'white',
    // 颜色
    // foreground: 'black',
    foreground: [
        // foreground color
        { style: colorFore },
        // outer squares of the positioner
        { row: 0, rows: 7, col: 0, cols: 7, style: colorOut },
        { row: -7, rows: 7, col: 0, cols: 7, style: colorOut },
        { row: 0, rows: 7, col: -7, cols: 7, style: colorOut },
        // inner squares of the positioner
        { row: 2, rows: 3, col: 2, cols: 3, style: colorIn },
        { row: -5, rows: 3, col: 2, cols: 3, style: colorIn },
        { row: 2, rows: 3, col: -5, cols: 3, style: colorIn },
    ],
    // logo: {
    //     image
    // }
    // logo: {
    //     // style: 'red'
    //     text: 'Java 陈序员',
    //     options: {
    //         color: 'red',
    //         fontSize: 1200
    //     }
    // }
})

const checked = ref(false)
const activeKey = ref('img')
const fileList = ref([])
const imageUrl = ref('/public/images/logo.ico')

const textLogo = ref({
    // text: 'Java 陈序员',
    text: 'Java',
    options: {
        fontSize: 120,
        // fontStyle: 'font-weight: bold; font-family: Arial, sans-serif;',
        // fontFamily: 'Arial, sans-serif',
        color: 'black',
        pad: 30,
        padColor: 'white',
        mode: 1,
    }

})

const beforeUpload = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
        console.log(options.value.logo)
        // 这里是Base64编码的字符串
        const base64String = e.target.result
        imageUrl.value = base64String
        const image = new Image();
        image.src = imageUrl.value

        delete options.value.logo
        options.value = {
            ...options.value,
            logo: {
                image
            }

        }
        console.log(options.value.logo, '2222222')
    }
    reader.readAsDataURL(file)

    return false
}

const addLogo = () => {
    if (checked.value) {
        const image = new Image();
        image.src = imageUrl.value
        options.value = {
            ...options.value,
            logo: {
                image
            }

        }
    } else {
        delete options.value.logo
    }
}

const changeLogo = (key) => {
    if (key === 'img') {
        const image = new Image();
        image.src = imageUrl.value
        options.value = {
            ...options.value,
            logo: {
                image
            }

        }
    } else if (key === 'text') {
        options.value = {
            ...options.value,
            logo: textLogo.value
        }
    }
}

const save = () => {
    const canvas = document.getElementById("qr-canvans")
    const link = document.createElement("a")
    // 将canvas转为Base64格式的图片数据URL
    link.href = canvas.toDataURL("image/png")
    // 设置下载的文件名
    link.download = `qr-${new Date().getTime()}.png`
    // 触发下载
    link.click()
}

</script>

<style lang="scss" scoped>
.qr-container {
    display: grid;
    justify-content: center;
}
</style>