<template>
    <a-card>
        <tool-header />
        <div class="fireworkContainer">
            <div class="left" v-show="configOpen">
                <a-form layout="vertical">
                    <a-form-item :label="`粒子数：${form.particles}`">
                        <a-slider v-model:value="form.particles" :min="10" :max="200" :step="5" />
                    </a-form-item>

                    <a-form-item :label="`爆炸大小：${form.explosion}`">
                        <a-slider v-model:value="form.explosion" :min="1" :max="20" />
                    </a-form-item>

                    <a-form-item :label="`发射频率：${form.intensity}`">
                        <a-slider v-model:value="form.intensity" :min="10" :max="100" :step="5" />
                    </a-form-item>

                    <a-form-item :label="`重力：${form.gravity}`">
                        <a-slider v-model:value="form.gravity" :min="0" :max="5" :step="0.1" />
                    </a-form-item>

                    <a-form-item :label="`拖尾长度：${form.traceLength}`">
                        <a-slider v-model:value="form.traceLength" :min="1" :max="20" />
                    </a-form-item>

                    <a-form-item :label="`闪烁：${form.flickering}`">
                        <a-slider v-model:value="form.flickering" :min="0" :max="100" />
                    </a-form-item>

                    <a-form-item :label="`颜色范围：${form.hue[0]}° ~ ${form.hue[1]}°`">
                        <a-slider v-model:value="form.hue" range :min="0" :max="360" />
                    </a-form-item>

                    <a-form-item label="点击发射">
                        <a-switch v-model:checked="form.click" checked-children="开" un-checked-children="关" />
                        <span class="tip">按住左键在指针处连续发射</span>
                    </a-form-item>

                    <a-form-item label="跟随指针">
                        <a-switch v-model:checked="form.move" checked-children="开" un-checked-children="关" />
                        <span class="tip">烟花从指针位置升起</span>
                    </a-form-item>
                </a-form>
            </div>

            <a-divider v-show="configOpen" type="vertical" style="height: 100%"></a-divider>

            <div class="right" ref="stageRef" :class="{ 'right-full': isFull }">
                <div class="firework-stage" ref="fireworkRef"></div>

                <!-- 全屏时这排按钮浮在黑画布上，只有 ghost（透明底 + 白字）压得住 -->
                <div class="corner-tools">
                    <template v-if="!isFull">
                        <a-button :ghost="isFull" @click="configOpen = !configOpen">
                            <template #icon>
                                <MenuUnfoldOutlined v-if="!configOpen" />
                                <MenuFoldOutlined v-else />
                            </template>
                            {{ configOpen ? '收起配置' : '展开配置' }}
                        </a-button>
                    </template>
                    <a-button :ghost="isFull" @click="clear">
                        <template #icon>
                            <ClearOutlined />
                        </template>
                        清空
                    </a-button>
                    <a-button :ghost="isFull" @click="toggleRun">
                        <template #icon>
                            <PlayCircleOutlined v-if="!running" />
                            <PauseCircleOutlined v-else />
                        </template>
                        {{ running ? '暂停' : '继续' }}
                    </a-button>
                    <a-button :ghost="isFull" @click="toggleSound">
                        <template #icon>
                            <SoundOutlined v-if="soundOn" />
                            <AudioMutedOutlined v-else />
                        </template>
                        {{ soundOn ? '关闭声音' : '开启声音' }}
                    </a-button>
                    <a-button :ghost="isFull" @click="toggleFullScreen">
                        <template #icon>
                            <FullscreenExitOutlined v-if="isFull" />
                            <FullscreenOutlined v-else />
                        </template>
                        {{ isFull ? '退出全屏' : '全屏' }}
                    </a-button>
                </div>
            </div>
        </div>
    </a-card>
</template>

<script setup>
import { Fireworks } from 'fireworks-js'
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import {
    AudioMutedOutlined, ClearOutlined, FullscreenExitOutlined, FullscreenOutlined, MenuFoldOutlined,
    MenuUnfoldOutlined, PauseCircleOutlined, PlayCircleOutlined, SoundOutlined,
} from '@ant-design/icons-vue'
import { createExplosionSoundUrls } from '@/utils/audio'

// 默认值取自库的默认参数，面板里只开放观感差异明显的几项，其余保持出厂设置
const form = reactive({
    particles: 50,
    explosion: 5,
    intensity: 30,
    gravity: 1.5,
    traceLength: 3,
    flickering: 50,
    hue: [0, 360],
    click: false,
    move: false,
})

// 每次改动都整体重推一次 options，库内部是深合并，不必逐项拼补丁
const buildOptions = () => ({
    autoresize: true,
    opacity: 0.5,
    acceleration: 1.05,
    friction: 0.97,
    gravity: form.gravity,
    particles: form.particles,
    traceLength: form.traceLength,
    traceSpeed: 10,
    explosion: form.explosion,
    intensity: form.intensity,
    flickering: form.flickering,
    lineStyle: 'round',
    hue: { min: form.hue[0], max: form.hue[1] },
    delay: { min: 30, max: 60 },
    rocketsPoint: { min: 50, max: 50 },
    lineWidth: {
        explosion: { min: 1, max: 3 },
        trace: { min: 1, max: 2 },
    },
    brightness: { min: 50, max: 80 },
    decay: { min: 0.015, max: 0.03 },
    mouse: { click: form.click, move: form.move, max: 1 },
})

// 库实例不放进 ref：Vue 会深度代理整个 canvas 实例，后续每帧访问都过一层 Proxy
let fireworks = null
let soundUrls = []

const fireworkRef = ref(null)
const stageRef = ref(null)
const configOpen = ref(true)
const running = ref(true)
const soundOn = ref(false)
const isFull = ref(false)

// 库的 pause() 是取反、start() 有空转保护，所以两个方向各调各的方法，不依赖它内部状态
const toggleRun = () => {
    running.value = !running.value
    if (running.value) {
        fireworks.start()
    } else {
        fireworks.pause()
    }
}

const clear = () => {
    fireworks.clear()
}

// 爆炸声延迟到首次开启时才合成，关着声音的人不用付这份开销
const toggleSound = () => {
    soundOn.value = !soundOn.value
    if (soundOn.value && !soundUrls.length) {
        soundUrls = createExplosionSoundUrls()
    }
    fireworks.updateOptions({ sound: { enabled: soundOn.value, files: soundUrls } })
}

// 全屏只放大预览区，左侧配置面板留在全屏层外面
const toggleFullScreen = () => {
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        stageRef.value?.requestFullscreen()
    }
}
const handleFullScreenChange = () => {
    isFull.value = !!document.fullscreenElement
}

watch(form, () => fireworks?.updateOptions(buildOptions()), { deep: true })

onMounted(() => {
    fireworks = new Fireworks(fireworkRef.value, buildOptions())
    fireworks.start()
    document.addEventListener('fullscreenchange', handleFullScreenChange)
})

onUnmounted(() => {
    // 不停的话 rAF、ResizeObserver 和音频会跟着页面留到路由切走以后
    fireworks?.stop()
    document.removeEventListener('fullscreenchange', handleFullScreenChange)
    soundUrls.forEach((url) => URL.revokeObjectURL(url))
})
</script>

<style lang="scss">
.fireworkContainer {
    margin: 0;
    padding: 0;
    width: 100%;
    height: calc(100vh - 270px);
    display: flex;

    .left {
        width: 40%;
        height: 100%;
        padding: 0px 6px;
        overflow-y: auto;
    }

    .right {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 16px;
        // flex 项默认 min-width: auto，不设 0 就压不过内容的最小宽度
        min-width: 0;

        // 画布排在工具条上面：工具条 flex: none 先占掉自己的高度，画布只拿剩下的，
        // 不会盖住按钮
        .corner-tools {
            flex: none;
            display: flex;
            justify-content: center;
            gap: 8px;
        }

        // min-height: 0 是必须的，否则 canvas 会把这里顶大、
        // 库的 ResizeObserver 量到变大的值、画布又跟着变大，来回震
        .firework-stage {
            flex: 1;
            min-height: 0;
            position: relative;
            overflow: hidden;
            background-color: #000;

            // 库把 canvas 追加进来、像素尺寸等于它量到的容器大小。canvas 是替换元素，
            // 留在文档流里就等于给这里挂了一个固定的 min-content 宽度：
            // 收起配置时画布量到全宽，再展开时 .right 就缩不回去，容器不缩 →
            // ResizeObserver 不触发 → 画布不缩，死锁（退出全屏同理）。
            // 绝对定位让它脱离文档流，尺寸只由这两条 100% 决定，位图分辨率仍由库按容器设置
            canvas {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        }

        // 全屏时浏览器会给全屏元素铺黑底，工具条所在的一条也一起压黑
        &.right-full {
            padding: 16px;
            background-color: #000;

            // 全屏下画布铺满整屏，工具条浮到画布底部居中，不再占掉一整条高度；
            // 它排在画布后面，同为定位元素、按文档顺序绘制，不用再加 z-index
            .corner-tools {
                position: absolute;
                bottom: 16px;
                left: 50%;
                transform: translateX(-50%);
            }
        }
    }
}

.tip {
    margin-left: 8px;
    color: #999;
    font-size: 12px;
}
</style>
