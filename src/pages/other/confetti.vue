<template>
    <a-card>
        <tool-header></tool-header>
        <splitpanes>
            <pane size="50">
                <a-form :model="options" :label-col="{ style: { width: '90px', marginRight: '12px' } }">
                    <a-form-item label="particleCount">
                        <a-slider v-model:value="options.particleCount" :min="1" :max="100" />
                    </a-form-item>
                </a-form>
                <a-form :model="options" :label-col="{ style: { width: '90px', marginRight: '12px' } }">
                    <a-form-item label="angle">
                        <a-slider v-model:value="options.angle" :min="0" :max="360" />
                    </a-form-item>
                </a-form>
                <a-form :model="options" :label-col="{ style: { width: '90px', marginRight: '12px' } }">
                    <a-form-item label="spread">
                        <a-slider v-model:value="options.spread" :min="0" :max="360" />
                    </a-form-item>
                </a-form>
                <a-form :model="options" :label-col="{ style: { width: '90px', marginRight: '12px' } }">
                    <a-form-item label="startVelocity">
                        <a-slider v-model:value="options.startVelocity" :min="1" :max="100" />
                    </a-form-item>
                </a-form>
                <a-form :model="options" :label-col="{ style: { width: '90px', marginRight: '12px' } }">
                    <a-form-item label="decay">
                        <a-slider v-model:value="options.decay" :min="0" :max="1" :step="0.1" />
                    </a-form-item>
                </a-form>
                <a-form :model="options" :label-col="{ style: { width: '90px', marginRight: '12px' } }">
                    <a-form-item label="gravity">
                        <a-slider v-model:value="options.gravity" :min="0" :max="1" :step="0.1" />
                    </a-form-item>
                </a-form>
                <a-form :model="options" :label-col="{ style: { width: '90px', marginRight: '12px' } }">
                    <a-form-item label="drift">
                        <a-slider v-model:value="options.drift" :min="-10" :max="10" />
                    </a-form-item>
                </a-form>
                <a-form :model="options" :label-col="{ style: { width: '90px', marginRight: '12px' } }">
                    <a-form-item label="ticks">
                        <a-slider v-model:value="options.ticks" :min="100" :max="1000" />
                    </a-form-item>
                </a-form>
                <a-form :model="options" :label-col="{ style: { width: '90px', marginRight: '12px' } }">
                    <a-form-item label="origin.x">
                        <a-slider v-model:value="options.origin.x" :min="0" :max="1" :step="0.1" />
                    </a-form-item>
                </a-form>
                <a-form :model="options" :label-col="{ style: { width: '90px', marginRight: '12px' } }">
                    <a-form-item label="origin.y">
                        <a-slider v-model:value="options.origin.y" :min="0" :max="1" :step="0.1" />
                    </a-form-item>
                </a-form>
                <a-form :model="options" :label-col="{ style: { width: '90px', marginRight: '12px' } }">
                    <a-form-item label="colors">
                        <a-checkbox-group v-model:value="options.colors" :options="colorOptions">
                            <!-- <template #label="{ label }">
                                <span :style="{color: label}">{{ label }}</span>
                            </template> -->
                        </a-checkbox-group>
                    </a-form-item>
                </a-form>
                <a-form :model="options" :label-col="{ style: { width: '90px', marginRight: '12px' } }">
                    <a-form-item label="shapes">
                        <a-checkbox-group v-model:value="options.shapes" :options="shapeOptions" />
                    </a-form-item>
                </a-form>
                <a-form :model="options" :label-col="{ style: { width: '90px', marginRight: '12px' } }">
                    <a-form-item label="scalar">
                        <a-slider v-model:value="options.scalar" :min="0" :max="1" :step="0.1" />
                    </a-form-item>
                </a-form>
                <a-button @click="start">Run</a-button>
                <a-button @click="startContinuous">Continuous</a-button>
                <a-button @click="stopContinuous">Stop</a-button>
                <canvas ref="confettiRef" class="confetti-container"></canvas>
            </pane>
            <pane size="50">
                <canvas ref="confettiRef" class="confetti-container"></canvas>
            </pane>
        </splitpanes>
    </a-card>
</template>

<script setup>
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import confetti from 'canvas-confetti'
import { onMounted, ref } from 'vue'
import { reactive } from 'vue'
import { toRaw } from 'vue'

const options = reactive({
    particleCount: 50,
    angle: 90,
    spread: 45,
    startVelocity: 45,
    decay: 0.9,
    gravity: 1,
    drift: 0,
    ticks: 200,
    origin: { x: 0.5, y: 0.5 },
    scalar: 1,
    elementCount: 100,
    zIndex: 100000000,
    colors: ['#a864fd', '#29cdff', '#78ff33', '#ff718d', '#fdff6a'],
    shapes: ['circle', 'star', 'square'],

})
const colorOptions = [
    { label: 'Red', value: '#a864fd' },
    { label: 'Blue', value: '#29cdff' },
    { label: 'Green', value: '#78ff33' },
    { label: 'Yellow', value: '#ff718d' },
    { label: 'Orange', value: '#fdff6a' },
]

const shapeOptions = [
    { label: 'Circle', value: 'circle' },
    { label: 'Star', value: 'star' },
    { label: 'Square', value: 'square' },
]

const confettiRef = ref()
const customConfetti = ref()
const animationId = ref()
const isAnimating = ref(false)

const initConfetti = () => {
    customConfetti.value = confetti.create(confettiRef.value, {
        resize: true,
        useWorker: true
    })
}

const randomInRange = (min, max) => {
    return Math.random() * (max - min) + min
}

const start = () => {
    console.log(toRaw(options), 'options')
    customConfetti.value({
        ...toRaw(options)
    })
}

const startContinuous = () => {
    if (isAnimating.value) return

    isAnimating.value = true
    const animate = () => {
        customConfetti.value({
            ...toRaw(options)
        })

        if (isAnimating.value) {
            animationId.value = requestAnimationFrame(animate)
        }
    }

    animate()
}

const stopContinuous = () => {
    isAnimating.value = false
    if (animationId.value) {
        cancelAnimationFrame(animationId.value)
    }
}

onMounted(() => {
    initConfetti()
})

// 组件卸载时清理动画帧
// ... existing code ...
</script>

<style scoped>
.confetti-container {
    width: 100%;
    height: calc(100vh - 360px);
}
</style>