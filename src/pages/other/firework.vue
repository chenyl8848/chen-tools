<template>
    <a-card>
        <tool-header />
        <div ref="fireworkContainerRef" class="firework-container">

        </div>
        <div class="btn-container">
            <a-space class="mgt-20">
                <a-button type="primary" @click="fullScreen" :icon="h(FullscreenOutlined)">全屏</a-button>
                <a-button type="primary" @click="pause" :icon="h(PlayCircleOutlined)">开始/暂停</a-button>
                <a-button type="primary" @click="clear" :icon="h(ClearOutlined)">清空</a-button>
                <a-button type="primary" @click="sound" :icon="h(ClearOutlined)">声音</a-button>
            </a-space>
        </div>
    </a-card>
</template>

<script setup>
import { Fireworks } from 'fireworks-js'
import { onMounted, ref, h } from 'vue'
import { FullscreenOutlined, PlayCircleOutlined, ClearOutlined } from '@ant-design/icons-vue'
import { useFullScreen } from '@/hook/global'

const fireworkContainerRef = ref()
const fireworks = ref()
const openSound = ref()

const initFirework = () => {

    fireworks.value = new Fireworks(fireworkContainerRef.value, {
        autoresize: true,
        opacity: 0.5,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 50,
        traceLength: 3,
        traceSpeed: 10,
        explosion: 5,
        intensity: 30,
        flickering: 50,
        lineStyle: 'round',
        hue: {
            min: 0,
            max: 360
        },
        delay: {
            min: 30,
            max: 60
        },
        rocketsPoint: {
            min: 50,
            max: 50
        },
        lineWidth: {
            explosion: {
                min: 1,
                max: 3
            },
            trace: {
                min: 1,
                max: 2
            }
        },
        brightness: {
            min: 50,
            max: 80
        },
        decay: {
            min: 0.015,
            max: 0.03
        },
        mouse: {
            click: false,
            move: false,
            max: 1
        }
    })
    fireworks.value.start()

    openSound.value = fireworks.value.currentOptions.sound.enabled
}

const [isFullScreen, fullScreen] = useFullScreen(fireworkContainerRef)

const pause = () => {
    const value = fireworks.value.pause()
}

const clear = () => {
    fireworks.value.clear()
}

const sound = () => {
    console.log(fireworks.value.currentOptions, openSound.value)
    fireworks.value.updateOptions({ ...fireworks.value.currentOptions, sound: { enabled: !openSound.value } })
    openSound.value = !openSound.value
    console.log(fireworks.value.currentOptions, openSound.value)
}

onMounted(() => {
    initFirework()
})
</script>

<style lang="css">
.firework-container {
    height: calc(100vh - 350px);
    background-color: black;
}

.btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>