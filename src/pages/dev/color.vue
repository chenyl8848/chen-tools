<template>
    <a-card>
        <tool-header></tool-header>
        <div class="color-container">
            <div>
                <a-divider orientation="left">SketchPicker</a-divider>
                <SketchPicker v-model="color"></SketchPicker>
            </div>
            <div>
                <a-divider orientation="left">PhotoshopPicker</a-divider>
                <PhotoshopPicker v-model="color"></PhotoshopPicker>
            </div>
            <div>
                <a-divider orientation="left">ChromePicker</a-divider>
                <ChromePicker v-model="color" />
            </div>
            <div>
                <a-divider orientation="left">SwatchesPicker</a-divider>
                <SwatchesPicker v-model="color"></SwatchesPicker>
            </div>
        </div>
        <div class="color-container">
            <div class="color-item">
                <a-divider orientation="left">CompactPicker</a-divider>
                <CompactPicker v-model="color" />
            </div>
            <div class="color-item">
                <a-divider orientation="left">GrayscalePicker</a-divider>
                <GrayscalePicker v-model="color" />
            </div>
            <div class="color-item">
                <a-divider orientation="left">TwitterPicker</a-divider>
                <TwitterPicker v-model="color"></TwitterPicker>
            </div>
            <div class="color-item">
                <a-divider orientation="left">SliderPicker</a-divider>
                <SliderPicker v-model="color"></SliderPicker>
            </div>
        </div>
        <a-divider>HueSlider</a-divider>
        <HueSlider v-model="color" class="mgb-20"></HueSlider>
        <a-divider>HSLSliders</a-divider>
        <HSLSliders v-model="color" class="mgb-20"></HSLSliders>
        <a-divider>HSVSliders</a-divider>
        <HSVSliders v-model="color" class="mgb-20"></HSVSliders>
        <a-divider>RGBSliders</a-divider>
        <RGBSliders v-model="color" class="mgb-20"></RGBSliders>
    </a-card>
</template>

<script setup>
import { ChromePicker, CompactPicker, GrayscalePicker, HSLSliders, HSVSliders, HueSlider, PhotoshopPicker, RGBSliders, SketchPicker, SliderPicker, SwatchesPicker, TwitterPicker } from 'vue-color'

const color = defineModel({
    default: '#68CCCA'
})
</script>

<style lang="scss" scoped>
.color-container {
    display: flex;
    justify-content: space-around;
    flex-flow: row wrap;
    margin-bottom: 20px;

    .color-item {
        /* 每个子项占据25%的宽度 */
        width: 25%;
        /* 确保padding不会影响元素的宽度 */
        box-sizing: border-box;
    }
}
</style>