<template>
    <a-card>
        <tool-header></tool-header>
        <splitpanes>
            <pane size="50">
                <a-form :model="characterForm" name="basic" :label-col="{ span: 2 }" :wrapper-col="{ span: 16 }"
                    autocomplete="off">
                    <a-form-item label="汉字" name="character">
                        <a-input v-model:value="characterForm.character" :maxlength="1" />
                    </a-form-item>
                    <a-form-item label="宽度" name="width">
                        <a-slider v-model:value="characterForm.width" :min="30" :max="500" />
                    </a-form-item>
                    <a-form-item label="高度" name="height">
                        <a-slider v-model:value="characterForm.height" :min="30" :max="500" />
                    </a-form-item>
                    <a-form-item label="边距" name="padding">
                        <a-slider v-model:value="characterForm.padding" />
                    </a-form-item>
                    <a-form-item label="显示" name="showCharacter">
                        <a-checkbox v-model:checked="characterForm.showCharacter"
                            @change="characterChange"></a-checkbox>
                    </a-form-item>
                    <a-form-item label="轮廓" name="showOutline">
                        <a-checkbox v-model:checked="characterForm.showOutline" @change="outlineChange"></a-checkbox>
                    </a-form-item>
                    <!-- <a-form-item label="速度" name="strokeAnimationSpeed">
                        <a-slider v-model:value="characterForm.strokeAnimationSpeed" :min="1" :max="10" />
                    </a-form-item> -->
                    <a-form-item label="颜色" name="strokeColor">
                        <a-popover>
                            <template #content>
                                <SketchPicker v-model="characterForm.strokeColor"></SketchPicker>
                            </template>
                            <a-button :style="{ width: '100%', backgroundColor: characterForm.strokeColor }"></a-button>
                        </a-popover>
                    </a-form-item>
                    <a-form-item label="偏旁" name="radicalColor">
                        <a-popover>
                            <template #content>
                                <SketchPicker v-model="characterForm.radicalColor"></SketchPicker>
                            </template>
                            <a-button
                                :style="{ width: '100%', backgroundColor: characterForm.radicalColor }"></a-button>
                        </a-popover>
                    </a-form-item>
                    <a-form-item :wrapper-col="{ offset: 2, span: 16 }">
                        <a-space size="large">
                            <a-button type="primary" @click="animateCharacter"
                                :icon="h(PlayCircleOutlined)">开始</a-button>
                            <a-button type="primary" @click="loopCharacterAnimation"
                                :icon="h(LoadingOutlined)">循环</a-button>
                            <a-button type="primary" @click="pauseAnimation"
                                :icon="h(PauseCircleOutlined)">暂停</a-button>
                            <a-button type="primary" @click="resumeAnimation" :icon="h(RedoOutlined)">恢复</a-button>
                            <a-tooltip placement="bottom">
                                <template #title>
                                    <span>使用鼠标进行编写</span>
                                </template>
                                <a-button type="primary" @click="quiz" :icon="h(EditOutlined)">测验</a-button>
                            </a-tooltip>
                        </a-space>
                    </a-form-item>
                </a-form>
            </pane>
            <pane size="50">
                <!-- <div ref="characterRef" class="character-container"></div> -->
                <div class="character-container">
                    <!-- <svg xmlns="http://www.w3.org/2000/svg" ref="characterRef"
                        :style="{ width: characterForm.width, height: characterForm.height }">
                        <line x1="0" y1="0" x2="300" y2="300" stroke="#DDD" />
                        <line x1="300" y1="0" x2="0" y2="300" stroke="#DDD" />
                        <line x1="150" y1="0" x2="150" y2="300" stroke="#DDD" />
                        <line x1="0" y1="150" x2="300" y2="50" stroke="#DDD" />
                    </svg> -->

                    <svg xmlns="http://www.w3.org/2000/svg" :width="characterForm.width" :height="characterForm.height"
                        ref="characterRef">
                        <!-- 对角线 -->
                        <line :x1="0" :y1="0" :x2="characterForm.width" :y2="characterForm.height" stroke="#DDD" />
                        <line :x1="characterForm.width" :y1="0" :x2="0" :y2="characterForm.height" stroke="#DDD" />
                        <!-- 中线 -->
                        <line :x1="characterForm.width / 2" :y1="0" :x2="characterForm.width / 2"
                            :y2="characterForm.height" stroke="#DDD" />
                        <line :x1="0" :y1="characterForm.height / 2" :x2="characterForm.width"
                            :y2="characterForm.height / 2" stroke="#DDD" />
                        <rect :x="0" :y="0" :width="characterForm.width" :height="characterForm.height" fill="none"
                            stroke="#DDD" stroke-width="2" />
                    </svg>
                </div>
            </pane>
        </splitpanes>
    </a-card>
</template>

<script setup>
import { onMounted, ref, reactive, watchEffect, watch, h } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { SketchPicker } from 'vue-color'
import HanziWriter from 'hanzi-writer'
import { PlayCircleOutlined, PauseCircleOutlined, RedoOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons-vue'

const characterForm = reactive({
    character: '我',
    width: 300,
    height: 300,
    padding: 5,
    showCharacter: true,
    showOutline: true,
    strokeAnimationSpeed: 1,
    strokeColor: '#555',
    // 偏旁颜色
    radicalColor: '#555',
})

const characterRef = ref(null)
const characterWriter = ref(null)
const initCharacter = () => {
    characterWriter.value = HanziWriter.create(characterRef.value, characterForm.character, {
        width: characterForm.width,
        height: characterForm.height,
        padding: characterForm.padding,
        showCharacter: characterForm.showCharacter,
        showOutline: characterForm.showOutline,
        strokeAnimationSpeed: characterForm.strokeAnimationSpeed,
        strokeColor: characterForm.strokeColor,
        radicalColor: characterForm.radicalColor
    })
}

/**
 * 是否显示汉字
 */
const characterChange = () => {
    if (characterForm.showCharacter) {
        characterWriter.value.showCharacter()
    } else {
        characterWriter.value.hideCharacter()
    }
}

/**
 * 轮廓切换
 */
const outlineChange = () => {
    if (characterForm.showOutline) {
        characterWriter.value.showOutline()
    } else {
        characterWriter.value.hideOutline()
    }
}

/**
 * 动画
 */
const animateCharacter = () => {
    characterWriter.value.animateCharacter()
}

/**
 * 循环动画
 */
const loopCharacterAnimation = () => {
    characterWriter.value.loopCharacterAnimation()
}

/**
 * 暂停动画
 */
const pauseAnimation = () => {
    characterWriter.value.pauseAnimation()
}

/**
 * 恢复动画
 */
const resumeAnimation = () => {
    characterWriter.value.resumeAnimation()
}

/**
 * 测验
 */
const quiz = () => {
    characterWriter.value.quiz()
}

// 更新汉字
watch(() => characterForm.character, (newValue) => characterWriter.value.setCharacter(characterForm.character))

// // 更新尺寸
// watch(() => characterForm.width, characterForm.height, characterForm.padding, (newValue) => characterWriter.value.updateDimensions(characterForm))

// 更新颜色
watch(() => characterForm.strokeColor, (newValue) => {
    characterWriter.value.updateColor('strokeColor', characterForm.strokeColor)
})
watch(() => characterForm.radicalColor, (newValue) => {
    characterWriter.value.updateColor('radicalColor', characterForm.radicalColor)
})

// 使用 watchEffect 同时监听多个属性
watchEffect(() => {
    const { width, height, padding } = characterForm

    if (characterWriter.value) {
        // 更新尺寸
        characterWriter.value.updateDimensions({ width, height, padding })
    }
})

onMounted(() => {
    initCharacter()
})
</script>

<style lang="scss" scoped>
.character-container {
    display: grid;
    justify-content: center;
}
</style>