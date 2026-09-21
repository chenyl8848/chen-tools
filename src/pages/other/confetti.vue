<template>
    <a-card>
        <tool-header />
        <div class="confettiContainer">
            <div class="left" v-show="configOpen">
                <a-form layout="vertical">
                    <a-form-item label="撒花样式">
                        <div class="presets">
                            <a-button v-for="item in presets" :key="item.key"
                                :type="item.key === currentKey ? 'primary' : 'default'" @click="runPreset(item)">
                                {{ item.label }}
                            </a-button>
                        </div>
                    </a-form-item>

                    <!-- 关掉循环就是「点一次撒一波」：样式按钮和舞台都只触发单次 -->
                    <a-form-item label="循环撒花">
                        <a-switch v-model:checked="form.loop" checked-children="开" un-checked-children="关"
                            @change="onLoopChange" />
                        <span class="tip">关着点一次撒一波，打开就一直撒</span>
                    </a-form-item>

                    <!-- 图案和撒花方式是两回事：样式决定怎么撒，这里只换撒出来的形状 -->
                    <a-form-item label="自定义图标">
                        <a-switch v-model:checked="form.customIconOn" checked-children="开"
                            un-checked-children="关" @change="onCustomIconChange" />
                        <span class="tip">打开后，上面选的那套撒法照旧，只把图案换掉；尺寸会顶到
                            {{ DEFAULT_ICON_SCALAR }}×，关掉还原</span>

                        <!-- 跟自定义配色同构：上面一排是图标列表，选中哪块下面就改哪块 -->
                        <div v-if="form.customIconOn" class="editor">
                            <span class="tip">点上面的图标选中，下面改的就是它；多个图标混着撒</span>

                            <div class="chips">
                                <button v-for="(icon, index) in form.customIcons" :key="index" type="button"
                                    class="chip" :class="{ active: index === iconIndex }" :title="icon"
                                    @click="iconIndex = index">{{ icon || DEFAULT_CUSTOM_ICONS[0] }}</button>
                                <button v-if="canAddIcon" type="button" class="chip add" title="添加图标"
                                    @click="addCustomIcon">+</button>
                            </div>

                            <div class="chips">
                                <button v-for="emoji in ICON_PRESETS" :key="emoji" type="button" class="chip"
                                    @click="form.customIcons[iconIndex] = emoji">{{ emoji }}</button>
                            </div>
                            <a-input v-model:value="form.customIcons[iconIndex]" placeholder="🎉"
                                @blur="normalizeCustomIcon" @press-enter="normalizeCustomIcon" />
                            <span class="tip">离开输入框时只留一个字符，❤️ 这种带变体选择符的算一个</span>

                            <a-button size="small" danger :disabled="form.customIcons.length <= 1"
                                @click="removeCustomIcon(iconIndex)">删除这个图标</a-button>
                        </div>
                    </a-form-item>

                    <a-form-item label="配色">
                        <div class="palettes">
                            <button v-for="item in paletteOptions" :key="item.key" type="button" class="palette"
                                :class="{ active: item.key === form.palette }" :title="item.label"
                                :aria-pressed="item.key === form.palette" @click="selectPalette(item)">
                                <span v-for="(color, index) in item.colors" :key="index" class="swatch"
                                    :style="{ backgroundColor: color }"></span>
                            </button>
                        </div>
                        <span class="tip">花瓣雨、自定义图标是 emoji 原色，不受配色影响</span>

                        <!-- 自定义配色既然能改，就不用每块色再配一个弹层：
                             点色块选中，下面这一个取色器改的就是选中的那块。
                             整块只在点「自定义」时展开，点外面就收起来，免得挡着下面的参数 -->
                        <div v-if="form.palette === 'custom' && customColorOpen" ref="customColorRef" class="editor">
                            <div class="chips">
                                <button v-for="(color, index) in form.customColors" :key="index" type="button"
                                    class="chip" :class="{ active: index === customIndex }"
                                    :style="{ backgroundColor: color }" :title="color" @click="customIndex = index">
                                </button>
                                <button v-if="canAddColor" type="button" class="chip add" title="添加颜色"
                                    @click="addCustomColor">+</button>
                            </div>
                            <SketchPicker :model-value="form.customColors[customIndex]" disable-alpha
                                :preset-colors="presetColors"
                                @update:model-value="(value) => (form.customColors[customIndex] = value)" />
                            <a-button size="small" danger :disabled="form.customColors.length <= 1"
                                @click="removeCustomColor(customIndex)">删除这个颜色</a-button>
                        </div>
                    </a-form-item>

                    <a-form-item :label="`强度：${form.intensity}×`">
                        <a-slider v-model:value="form.intensity" :min="0.5" :max="3" :step="0.1" />
                    </a-form-item>

                    <a-form-item :label="`尺寸：${form.scalar}×`">
                        <a-slider v-model:value="form.scalar" :min="0.5" :max="4" :step="0.1" />
                    </a-form-item>

                    <a-form-item :label="`飘落时长：${form.duration}×`">
                        <a-slider v-model:value="form.duration" :min="0.3" :max="2" :step="0.1" />
                    </a-form-item>

                    <a-form-item :label="`重力：${form.gravity}`">
                        <a-slider v-model:value="form.gravity" :min="0" :max="3" :step="0.1" />
                    </a-form-item>

                    <a-form-item label="音效">
                        <a-switch v-model:checked="soundOn" checked-children="开" un-checked-children="关"
                            @change="onSoundChange" />
                        <span class="tip">撒花时放一声礼炮响</span>
                    </a-form-item>
                </a-form>
            </div>

            <a-divider v-show="configOpen" type="vertical" style="height: 100%"></a-divider>

            <div class="right" ref="stageRef" :class="{ 'right-full': isFull }">
                <!-- 撒花位图必须长在舞台内部：全屏元素在浏览器里是独立的一层，
                     挂在 body 上的 canvas 会被它整个盖住，全屏下就什么也看不见 -->
                <canvas ref="canvasRef" class="confetti-canvas"></canvas>
                <div class="stage" @click="runPreset(currentPreset)">
                    <p class="word">完结撒花</p>
                    <p class="hint">{{ stageHint }}</p>
                </div>

                <div class="corner-tools">
                    <a-button v-if="!isFull" @click="configOpen = !configOpen">
                        <template #icon>
                            <MenuUnfoldOutlined v-if="!configOpen" />
                            <MenuFoldOutlined v-else />
                        </template>
                        {{ configOpen ? '收起配置' : '展开配置' }}
                    </a-button>
                    <a-button :ghost="isFull" @click="toggleRun">
                        <template #icon>
                            <PauseCircleOutlined v-if="runButtonPaused" />
                            <PlayCircleOutlined v-else />
                        </template>
                        {{ runButtonLabel }}
                    </a-button>
                    <a-button :ghost="isFull" @click="clear">
                        <template #icon>
                            <ClearOutlined />
                        </template>
                        清空
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
import confetti from 'canvas-confetti'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import {
    ClearOutlined, FullscreenExitOutlined, FullscreenOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
    PauseCircleOutlined, PlayCircleOutlined,
} from '@ant-design/icons-vue'
import { SketchPicker } from 'vue-color'
import { createExplosionSoundUrls } from '@/utils/audio'

// 合成出来的礼炮声有 2 秒多的余韵，持续撒花时每一波都放会糊成一片噪音。
// 隔 1.5 秒放一声，三个变体轮一圈要 4.5 秒，不会自己打断自己
const SOUND_COOLDOWN = 1500

// 自定义配色的起始色，也是「加一块」时依次取用的色序：
// 都挑亮的，加进去点一下就能看出效果，不用先去调明度
const DEFAULT_CUSTOM_COLORS = ['#ff3b3b', '#ff9f1c', '#ffe600', '#3ddc84', '#2ec4ff', '#8b5cf6', '#ff2d95', '#00e5ff']

// 图标编辑器的快选，都是撒花场景里最常用的那几个；新增图标也从这个序列里取
const ICON_PRESETS = ['🎉', '🎊', '❤️', '⭐', '🔥', '🌸']

// 默认就给三个，一进来就能看出多个图标是混着撒的
const DEFAULT_CUSTOM_ICONS = ['🎉', '🎊', '❤️']

// 每个图标是一张栅格化位图，虽然便宜但也没必要堆太多，混起来反而认不出
const MAX_CUSTOM_ICONS = 6

// 图标位图太小就认不出是什么，打开自定义图标时用它顶掉当前尺寸（滑块范围 0.5~4）
const DEFAULT_ICON_SCALAR = 2.5

const form = reactive({
    palette: 'rainbow',
    customColors: DEFAULT_CUSTOM_COLORS.slice(0, 3),
    // 图案是叠在撒花方式之上的，所以默认关着，不干扰预设各自的形状（星星、彩带、🌸）
    customIcons: [...DEFAULT_CUSTOM_ICONS],
    customIconOn: false,
    // 默认单次：舞台上点一下撒一波就够了，要连续再自己去开循环
    loop: false,
    intensity: 1,
    scalar: 1.2,
    // ticks 在预设之间差得很远（烟花 140、彩带 500），给绝对值会抹平这个差别，所以按倍率来
    duration: 1,
    gravity: 1,
})

// 每档给 5~6 个色，库是按 colors[下标 % 长度] 均匀分配的。
// 全部取饱和度高的中间调：常态下彩纸铺满视口，大半落在浅灰页面上，
// 白色和过淡的颜色在那里等于没撒
const palettes = [
    { key: 'rainbow', label: '彩虹', colors: ['#ff3b3b', '#ff9f1c', '#ffe600', '#3ddc84', '#2ec4ff', '#8b5cf6'] },
    { key: 'festive', label: '喜庆', colors: ['#e60012', '#ff4d4f', '#ff7875', '#ffaa00', '#ffd666'] },
    { key: 'candy', label: '糖果', colors: ['#ff85c0', '#ffa3d1', '#ffd666', '#91d5ff', '#b37feb', '#95de64'] },
    { key: 'aurora', label: '极光', colors: ['#00e5ff', '#00b8d4', '#536dfe', '#7c4dff', '#64ffda'] },
    { key: 'neon', label: '霓虹', colors: ['#ff2d95', '#00fff0', '#c8ff00', '#ff00e5', '#7b2dff'] },
    { key: 'forest', label: '森绿', colors: ['#22c55e', '#84cc16', '#16a34a', '#4ade80', '#a3e635'] },
]

// 自定义档不是另一套代码：把存在 form 里的色值挂到 computed 上拼成第七档，
// 色带渲染、activePalette、fire 就都不必为它开特例
const paletteOptions = computed(() => [
    ...palettes,
    { key: 'custom', label: '自定义', colors: form.customColors },
])

// 库取色是 colors[下标 % 长度]，色越多每种分到的粒子越少，撒出来反而看不出配色
const MAX_CUSTOM_COLORS = 8

// 取色器的快捷色就用内置色板：自定义多半是在这套亮色上做加减，而不是从零调
const presetColors = [...new Set(palettes.flatMap((item) => item.colors))]

const customIndex = ref(0)
const canAddColor = computed(() => form.customColors.length < MAX_CUSTOM_COLORS)

// 取色器展开后一并盖住下面的参数，点它以外任何地方就收起来。
// 图标那个编辑框由自己的开关管着，不需要这一套
const customColorOpen = ref(false)
const customColorRef = ref(null)

const selectPalette = (item) => {
    form.palette = item.key
    // 切到「自定义」就展开编辑框；已经展开时再点一次也是展开，不必做成开关
    customColorOpen.value = item.key === 'custom'
}

// 判 mousedown 而不是 click：在取色器里拖完松手时指针常落在面板外，
// 那一下会补发一个 click，按 click 判会边拖边关
const handleOutsideMouseDown = (event) => {
    if (customColorOpen.value && !customColorRef.value?.contains(event.target)) {
        customColorOpen.value = false
    }
}

const addCustomColor = () => {
    form.customColors.push(DEFAULT_CUSTOM_COLORS[form.customColors.length % DEFAULT_CUSTOM_COLORS.length])
    // 加完直接选中新的那块，接着就能调
    customIndex.value = form.customColors.length - 1
}

const removeCustomColor = (index) => {
    form.customColors.splice(index, 1)
    // 删掉末尾那块时下标会落到数组外面，夹回来才不会让取色器读到 undefined
    customIndex.value = Math.min(index, form.customColors.length - 1)
}

// 图标编辑器跟配色那套同构：上面一排是列表，选中哪块下面就改哪块
const iconIndex = ref(0)
const canAddIcon = computed(() => form.customIcons.length < MAX_CUSTOM_ICONS)

const addCustomIcon = () => {
    form.customIcons.push(ICON_PRESETS[form.customIcons.length % ICON_PRESETS.length])
    iconIndex.value = form.customIcons.length - 1
}

const removeCustomIcon = (index) => {
    form.customIcons.splice(index, 1)
    iconIndex.value = Math.min(index, form.customIcons.length - 1)
}

// 一个格子只收一个字素：`❤️` 这种带变体选择符的算一个，按 UTF-16 单元数截是截不对的。
// 收在失焦/回车时，不逐键收——中文输入法打字过程中输入框里是拼音串（"gongxi"），
// 逐键截断会把输入法自己的缓冲打散。空串留着，撒的时候按默认值兜底
const segmenter = new Intl.Segmenter('zh', { granularity: 'grapheme' })

const normalizeCustomIcon = () => {
    const [first] = segmenter.segment(form.customIcons[iconIndex.value])
    form.customIcons[iconIndex.value] = first ? first.segment : ''
}

// 三个雨类预设共用的一套落体参数。
// 原来它们给的是 spread: 360 + startVelocity: 0，而初速度为 0 时角度是白给的
// （velocity 只在 update 里乘 decay，起手是 0 就永远是 0），加上 origin 是每次 fire
// 一份——一发的几颗粒子全从同一个点沿同一条竖线落下，叠成一朵怪图形。
// 花瓣小的时候看着像个「花簇」，换成图标就一眼看出不对了。
// angle 270 是朝下，spread 180 是「朝下的整个半平面」：这是不会往上飞的极限张角，
// 兜住的那点初速度让同发的粒子在画面上沿之外就散开（散布全程约 v×10 像素）
const RAIN_MOTION = { angle: 270, spread: 180, startVelocity: 20 }

// 每个预设只管撒「一波」，持续由调度器按 interval 反复触发。
// 波次里的粒子数按各自的间隔配过，让每秒落下来的量大致在 20~120 之间：
// 少了看不出流动感，多了既卡又糊成一片
const presets = [
    {
        key: 'classic',
        label: '经典撒花',
        interval: 260,
        run: () => fire({ particleCount: 30, spread: 80, ticks: 200, origin: { y: 0.7 } }),
    },
    {
        key: 'star',
        label: '星星雨',
        interval: 150,
        // 从屏幕上方随机落点飘下，连起来才像「下了一场」
        run: () => fire({
            particleCount: 6,
            ...RAIN_MOTION,
            ticks: 400,
            shapes: ['star'],
            origin: { x: Math.random(), y: -0.1 },
        }),
    },
    {
        key: 'flower',
        label: '花瓣雨',
        interval: 180,
        run: () => fire({
            particleCount: 4,
            ...RAIN_MOTION,
            ticks: 500,
            shapes: [emojiShape('🌸')],
            origin: { x: Math.random(), y: -0.1 },
        }),
    },
    {
        key: 'cannon',
        label: '双向礼炮',
        interval: 90,
        run: () => {
            fire({ particleCount: 4, angle: 60, spread: 55, ticks: 200, origin: { x: 0, y: 0.7 } })
            fire({ particleCount: 4, angle: 120, spread: 55, ticks: 200, origin: { x: 1, y: 0.7 } })
        },
    },
    {
        key: 'fireworks',
        label: '烟花连环',
        interval: 300,
        // spread 360 配随机落点，一发就是一朵球形烟花
        run: () => fire({
            particleCount: 25,
            spread: 360,
            startVelocity: 30,
            ticks: 140,
            origin: { x: Math.random(), y: Math.random() * 0.5 },
        }),
    },
    {
        key: 'streamer',
        label: '彩带雨',
        interval: 150,
        run: () => fire({
            particleCount: 5,
            ...RAIN_MOTION,
            ticks: 500,
            shapes: [streamerShape()],
            origin: { x: Math.random(), y: -0.1 },
        }),
    },
]

const canvasRef = ref(null)
let canvasConfetti = null

// CSS 已经把 canvas 铺满视口，这里把位图尺寸跟上它的显示尺寸。
// 非得自己同步一次：库只在自己造 canvas 时才会每次开播前重新量，
// 用户传进去的 canvas 它量过第一次就再也不量了，切完全屏位图还停在旧尺寸上被拉糊
const syncCanvasSize = () => {
    const canvas = canvasRef.value
    // 写 width/height 会清空位图，尺寸没变就别碰，连撒时每几十毫秒会调到这里
    if (canvas && (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight)) {
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight
    }
}

const activePalette = computed(() => paletteOptions.value.find((item) => item.key === form.palette))

// 自定义图案只在开关打开时接管 shapes；关着给 null，让每套撒法留着自己的形状
// （预设没给 shapes 的，库里 prop() 会补上默认的方块）。
// 多个图标不用另写混撒：库是逐粒子 shapes[randomInt(0, shapes.length)] 取形状的，
// 给几个就自然混成几种。
// 这里必须是数组：给单个对象会取到 undefined，绘制时读 shape.type 直接抛错，
// 而重新排帧的调用排在绘制之后——一抛错循环就停在原地不再有下一帧，
// 得靠「清空」走一次 reset() 才复位。所以也不能给空数组，空数组同样取到 undefined
const customShapes = computed(() => (
    form.customIconOn
        ? form.customIcons.map((icon) => emojiShape(icon || DEFAULT_CUSTOM_ICONS[0]))
        : null
))

// 预设只管形状和轨迹，配色和几个力度参数在 fire 里统一覆盖，
// 免得同一项在两处给值、互相打架
const fire = (options) => {
    syncCanvasSize()
    canvasConfetti({
        ...options,
        // 换成自定义图案时只动形状，轨迹参数一概不动——
        // 「图案」和「怎么撒」是两回事，叠加而不是替换
        shapes: customShapes.value ?? options.shapes,
        colors: activePalette.value.colors,
        particleCount: Math.round(options.particleCount * form.intensity),
        ticks: Math.round(options.ticks * form.duration),
        scalar: form.scalar,
        gravity: form.gravity,
        disableForReducedMotion: true,
    })
    playSound()
}

const running = ref(false)
let loopId = null

// 只留一条自链的定时器：撒完一波再排下一波，效果就一直持续到点暂停。
// 不用 rAF 是因为预设的节奏本身就是几十到几百毫秒一发，每秒 60 发纯属浪费
const startLoop = (preset) => {
    stopLoop()
    running.value = true
    const tick = () => {
        preset.run()
        loopId = setTimeout(tick, preset.interval)
    }
    tick()
}

const stopLoop = () => {
    clearTimeout(loopId)
    loopId = null
    running.value = false
}

// shapeFromPath 要把路径逐点采样成变换矩阵，比较贵，建一次就够
let cachedStreamer
const streamerShape = () => {
    if (!cachedStreamer) {
        cachedStreamer = confetti.shapeFromPath({ path: 'M0 0 L5 0 L5 10 L0 10z' })
    }
    return cachedStreamer
}

// shapeFromText 把文字栅格化成位图，scalar 不同就是另一张图，按值缓存
const emojiCache = new Map()
const emojiShape = (text) => {
    const key = `${text}@${form.scalar}`
    if (!emojiCache.has(key)) {
        emojiCache.set(key, confetti.shapeFromText({ text, scalar: form.scalar }))
    }
    return emojiCache.get(key)
}

const soundOn = ref(false)
const audioPool = []
let soundUrls = []
let audioIndex = 0
let lastSoundAt = 0

// 音频是现合成的 wav，第一次打开开关时才做，一直静音的人不用付这份开销
const onSoundChange = (checked) => {
    if (checked && !audioPool.length) {
        soundUrls = createExplosionSoundUrls()
        soundUrls.forEach((url) => audioPool.push(new Audio(url)))
    }
}

const playSound = () => {
    if (!soundOn.value || !audioPool.length) return
    const now = performance.now()
    if (now - lastSoundAt < SOUND_COOLDOWN) return
    lastSoundAt = now
    // 三个变体轮流用，连着放两声时不会互相打断
    const audio = audioPool[audioIndex++ % audioPool.length]
    audio.currentTime = 0
    audio.play().catch(() => { })
}

const currentKey = ref(presets[0].key)
const currentPreset = computed(() => presets.find((item) => item.key === currentKey.value))

const runPreset = (preset) => {
    currentKey.value = preset.key
    if (form.loop) {
        // 换样式时 startLoop 内部会先停掉旧的，免得两套节奏叠在一起
        startLoop(preset)
    } else {
        // 单次模式：只撒这一波，粒子落完动画自己结束，库里会把动画对象置空
        preset.run()
    }
}

// 从循环切到单次时得先把在跑的循环停掉，否则它会继续撒下去
const onLoopChange = (checked) => {
    if (!checked) {
        stopLoop()
    }
}

// 打开自定义图标时把尺寸顶上去：图标是位图，屏幕上只有 10×尺寸 像素，
// 默认 1.2 时那十几像素根本分不出 🎉 和 🎊，等于白开。
// 记下打开前的值，关掉时还回去——用户自己拖过的尺寸不能被这趟切换吃掉
let scalarBeforeIcon = form.scalar

const onCustomIconChange = (checked) => {
    if (checked) {
        scalarBeforeIcon = form.scalar
        form.scalar = DEFAULT_ICON_SCALAR
    } else {
        form.scalar = scalarBeforeIcon
    }
}

const stageHint = computed(() => (form.loop ? '点击任意处开始，撒到点暂停为止' : '点击任意处撒一波'))

// 单次模式下没有循环可暂停，同一个按钮退化成「再撒一次」
const runButtonLabel = computed(() => (form.loop ? (running.value ? '暂停' : '继续') : '再撒一次'))
const runButtonPaused = computed(() => form.loop && running.value)

const toggleRun = () => {
    if (!form.loop) {
        // 单次模式下这个按钮就是「再撒一次」，没有暂停可谈
        currentPreset.value.run()
        return
    }
    if (running.value) {
        stopLoop()
    } else {
        startLoop(currentPreset.value)
    }
}

// 只扫掉屏幕上的粒子，不动循环状态；暂停后用它能省掉等残余粒子自然落完
const clear = () => {
    canvasConfetti.reset()
}

const stageRef = ref(null)
const configOpen = ref(true)
const isFull = ref(false)

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

onMounted(() => {
    // 不开 useWorker：它会把 canvas 交给 OffscreenCanvas 接管，之后不许再碰，
    // 而这里要自己同步位图尺寸。粒子量不大，留在主线程够了
    canvasConfetti = confetti.create(canvasRef.value, { resize: true })
    document.addEventListener('fullscreenchange', handleFullScreenChange)
    document.addEventListener('mousedown', handleOutsideMouseDown)
})

onUnmounted(() => {
    // 循环不停会接着撒，canvas 不清会跟到路由切走以后
    stopLoop()
    canvasConfetti?.reset()
    document.removeEventListener('fullscreenchange', handleFullScreenChange)
    document.removeEventListener('mousedown', handleOutsideMouseDown)
    soundUrls.forEach((url) => URL.revokeObjectURL(url))
})
</script>

<style lang="scss" scoped>
.confettiContainer {
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

        .presets {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;

            :deep(.ant-btn) {
                margin-inline-start: 0;
            }
        }

        .palettes {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;

            // 用原生 button 而不是 a-button：这里要的是一条无内边距的色带，
            // 而 a-form 本身会渲染成 <form>，所以 type 必须显式给 button
            .palette {
                display: flex;
                height: 28px;
                padding: 0;
                overflow: hidden;
                border: 1px solid #d9d9d9;
                border-radius: 6px;
                background: none;
                cursor: pointer;

                &.active {
                    border-color: #1677ff;
                    box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2);
                }

                .swatch {
                    flex: 1;
                }
            }
        }

        // 配色和图标两个编辑框共用同一套外壳：和上面的选择区用虚线上边隔开
        .editor {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px dashed #e5e5e5;

            // .tip 的 margin-left 是为了跟在开关后面才加的，这里单独成行得去掉
            .tip {
                margin-left: 0;
            }
        }

        .chips {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }

        .chip {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 26px;
            height: 26px;
            padding: 0;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            background: none;
            font-size: 16px;
            line-height: 1;
            cursor: pointer;

            // 正在编辑的那块得单独圈出来，否则看不出下面取色器改的是谁
            &.active {
                border-color: #1677ff;
                box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2);
            }

            &.add {
                border-style: dashed;
                color: #999;
            }
        }
    }

    .right {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 16px;
        // flex 项默认 min-width: auto，不设 0 就压不过内容的最小宽度
        min-width: 0;

        // 和库自己造的 canvas 一个套路：定在视口上、不吃点击。
        // 常态下视口就是整个窗口，全屏后祖先成了全屏元素，视口即整块屏幕
        .confetti-canvas {
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            // 压住页面内容，又不高过 antd 的弹层
            z-index: 1000;
        }

        .stage {
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            border-radius: 8px;
            cursor: pointer;
            // 深色底衬得彩纸更亮，点起来也更像舞台
            background: radial-gradient(circle at 50% 120%, #3b1d6e 0%, #170b2e 60%, #0b0616 100%);

            // 连点时不希望把字选中了
            user-select: none;

            .word {
                margin: 0;
                font-size: 56px;
                font-weight: bold;
                letter-spacing: 8px;
                color: rgba(255, 255, 255, 0.14);
            }

            .hint {
                margin: 0;
                font-size: 14px;
                letter-spacing: 2px;
                color: rgba(255, 255, 255, 0.4);
            }
        }

        // 工具条 flex: none 先占掉自己的高度，舞台只拿剩下的，不会盖住按钮
        .corner-tools {
            flex: none;
            display: flex;
            justify-content: center;
            gap: 8px;
        }

        &.right-full {
            .stage {
                border-radius: 0;
            }

            // 全屏下舞台铺满整屏，工具条浮到舞台底部居中；
            // 它排在舞台后面，同为定位元素、按文档顺序绘制，不用再加 z-index
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
