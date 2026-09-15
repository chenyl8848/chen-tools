<template>
    <a-card>
        <p class="title">抽奖</p>
        <div class="lotteryContainer">
            <div class="left" v-show="configOpen">
                <a-form layout="vertical">
                    <a-form-item label="类型">
                        <a-radio-group v-model:value="form.type" button-style="solid">
                            <a-radio-button value="LuckyWheel">大转盘</a-radio-button>
                            <a-radio-button value="LuckyGrid">九宫格</a-radio-button>
                            <a-radio-button value="SlotMachine">老虎机</a-radio-button>
                        </a-radio-group>
                    </a-form-item>

                    <a-form-item
                        :label="form.infinite ? '旋转时长：无限（手动停止）' : `旋转时长：${form.duration / 1000} 秒`">
                        <div class="duration-row">
                            <a-slider v-model:value="form.duration" :min="1000" :max="10000" :step="500"
                                :disabled="form.infinite" :tooltip-open="false" />
                            <a-switch v-model:checked="form.infinite" :disabled="spinning" checked-children="无限"
                                un-checked-children="定时" />
                        </div>
                    </a-form-item>

                    <a-form-item :label="`奖品（权重合计 ${totalWeight}）`">
                        <div class="prize-list">
                            <div class="prize-row" v-for="(prize, index) in prizes" :key="index">
                                <input type="color" v-model="prize.color" class="prize-color" title="奖品颜色" />
                                <a-input v-model:value="prize.name" class="prize-name" placeholder="奖品名称" />
                                <a-input-number v-model:value="prize.weight" :min="0" :step="1" class="prize-weight" />
                                <span class="prize-percent">{{ percentOf(prize) }}</span>
                                <a-button type="text" danger :disabled="prizes.length <= 2"
                                    @click="removePrize(index)">
                                    <template #icon>
                                        <DeleteOutlined />
                                    </template>
                                </a-button>
                            </div>
                        </div>
                        <a-button type="dashed" block @click="addPrize">
                            <template #icon>
                                <PlusOutlined />
                            </template>
                            添加奖品
                        </a-button>
                        <a-alert v-if="form.type === 'LuckyGrid' && prizes.length !== GRID_SLOT_COUNT"
                            type="warning" show-icon class="grid-tip"
                            :message="`九宫格固定 ${GRID_SLOT_COUNT} 个奖格，当前 ${prizes.length} 个，${prizes.length < GRID_SLOT_COUNT ? '不足部分自动用「谢谢参与」补足' : '超出的奖品不会出现在格子里'}`" />
                    </a-form-item>

                    <a-form-item label="按钮文字">
                        <a-input v-model:value="form.buttonText" placeholder="开始" />
                    </a-form-item>

                    <a-form-item label="中奖设置">
                        <a-select v-model:value="form.forcedIndex" style="width: 100%;">
                            <a-select-option :value="-1">按权重随机</a-select-option>
                            <a-select-option v-for="(prize, index) in prizes" :key="index" :value="index">
                                必中：{{ prize.name || `奖品 ${index + 1}` }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-form>
            </div>

            <a-divider v-show="configOpen" type="vertical" style="height: 100%"></a-divider>

            <div class="right" ref="rightDiv" :class="{ 'right-full': isFull }"
                :style="{ '--lottery-font': fontPx(14, 12), '--lottery-font-strong': fontPx(16, 13) }">
                <div class="corner-tools">
                    <!-- 全屏只放大预览区，左侧配置和挂在 body 上的弹窗都在全屏层外面，这两个入口收起来 -->
                    <template v-if="!isFull">
                        <a-button @click="configOpen = !configOpen">
                            <template #icon>
                                <MenuUnfoldOutlined v-if="!configOpen" />
                                <MenuFoldOutlined v-else />
                            </template>
                            {{ configOpen ? '收起配置' : '展开配置' }}
                        </a-button>
                        <a-button @click="showHistory = true">
                            <template #icon>
                                <HistoryOutlined />
                            </template>
                            抽奖记录
                        </a-button>
                    </template>
                    <a-button @click="toggleFullScreen">
                        <template #icon>
                            <FullscreenExitOutlined v-if="isFull" />
                            <FullscreenOutlined v-else />
                        </template>
                        {{ isFull ? '退出全屏' : '全屏' }}
                    </a-button>
                </div>

                <div class="canvas-area" ref="canvasArea">
                    <LuckyWheel v-if="form.type === 'LuckyWheel'" ref="luckyRef" :width="canvasSize"
                        :height="canvasSize" :blocks="wheelBlocks" :prizes="wheelPrizes" :buttons="wheelButtons"
                        @start="startDraw" @end="endDraw" />

                    <LuckyGrid v-else-if="form.type === 'LuckyGrid'" ref="luckyRef" :width="canvasSize"
                        :height="canvasSize" :cols="3" :rows="3" :blocks="gridBlocks" :prizes="gridPrizes"
                        :buttons="gridButtons" @start="startDraw" @end="endDraw" />

                    <SlotMachine v-else ref="slotRef" :width="canvasSize" :height="canvasSize" :blocks="slotBlocks"
                        :prizes="slotPrizes" :slots="slotSlots" @end="endDraw" />

                    <a-button v-if="form.type === 'SlotMachine'" type="primary"
                        :loading="spinning && !form.infinite" @click="startSlotDraw">
                        {{ form.infinite && spinning ? '停止' : '开始抽奖' }}
                    </a-button>

                    <p class="result">中奖结果：<strong>{{ lastResult || '—' }}</strong></p>
                </div>
            </div>
        </div>

        <a-modal v-model:open="showHistory" :title="`抽奖记录（共 ${history.length} 条）`" width="45%" centered>
            <a-table :columns="historyColumns" :data-source="history" row-key="time" size="small"
                :pagination="historyPagination" :locale="{ emptyText: '还没有抽奖记录' }" />
            <template #footer>
                <a-popconfirm :title="`确定清空全部 ${history.length} 条记录？`" ok-text="清空" cancel-text="取消"
                    @confirm="clearHistory">
                    <a-button danger :disabled="!history.length">清空</a-button>
                </a-popconfirm>
                <a-button type="primary" :disabled="!history.length" @click="exportHistory">
                    <template #icon>
                        <DownloadOutlined />
                    </template>
                    下载 CSV
                </a-button>
            </template>
        </a-modal>
    </a-card>
</template>

<script setup>
import { LuckyGrid, LuckyWheel, SlotMachine } from '@lucky-canvas/vue'
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import {
    DeleteOutlined, DownloadOutlined, FullscreenExitOutlined, FullscreenOutlined,
    HistoryOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined,
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { downloadCSVData } from '@/utils/common'
import { LOCAL_STORAGE_LOTTERY_HISTORY_KEY } from '@/utils/enum'

// 九宫格固定 3x3，按下标顺时针排列 8 个奖格，中心 (1,1) 放按钮
const GRID_CELLS = [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
    { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 1, y: 2 },
    { x: 0, y: 2 }, { x: 0, y: 1 },
]
const GRID_SLOT_COUNT = GRID_CELLS.length

const PALETTE = ['#f6d6d6', '#e9e8fe', '#fbe9d0', '#c8e8d8', '#d6e4f6', '#f3e2c7', '#e8e8e8', '#d9d2f0']

const MIN_SIZE = 200
// 画布边长取容器较短边的一部分，剩下的留给全屏按钮、开始按钮和结果文字
const CANVAS_RATIO = 0.75
// 字号 / 内边距的换算基准：320px 画布下 13px 字号的观感
const FONT_BASE = 320

// 预览区尺寸，由 ResizeObserver 提供；进出全屏、拉窗口都表现为它的变化，不需要分别处理
const box = ref({ width: 0, height: 0 })
const canvasSize = computed(() => {
    const { width, height } = box.value
    return Math.max(MIN_SIZE, Math.round(Math.min(width, height * CANVAS_RATIO)))
})
// 字号和内边距随画布线性缩放，避免铺大后字还是 13px
const fontPx = (base, min) => `${Math.max(min, Math.round(canvasSize.value * base / FONT_BASE))}px`

const prizes = ref([
    { name: '一等奖', weight: 1, color: PALETTE[0] },
    { name: '二等奖', weight: 3, color: PALETTE[1] },
    { name: '三等奖', weight: 6, color: PALETTE[2] },
    { name: '优惠券', weight: 10, color: PALETTE[3] },
    { name: '积分 x100', weight: 15, color: PALETTE[4] },
    { name: '积分 x50', weight: 20, color: PALETTE[5] },
    { name: '谢谢参与', weight: 30, color: PALETTE[6] },
    { name: '再来一次', weight: 15, color: PALETTE[7] },
])

const form = reactive({
    type: 'LuckyWheel',
    duration: 4000,
    buttonText: '开始',
    forcedIndex: -1,
    infinite: false,
})

const weightOf = (prize) => Math.max(0, Number(prize.weight) || 0)
const totalWeight = computed(() => prizes.value.reduce((sum, prize) => sum + weightOf(prize), 0))
const percentOf = (prize) => (totalWeight.value > 0 ? ((weightOf(prize) / totalWeight.value) * 100).toFixed(1) : '0.0') + '%'

// 九宫格奖格数固定，补足或截断到 8 个（补足项权重为 0，不会被抽中）
const effectivePrizes = computed(() => {
    if (form.type !== 'LuckyGrid') return prizes.value
    const list = prizes.value.slice(0, GRID_SLOT_COUNT)
    while (list.length < GRID_SLOT_COUNT) {
        list.push({ name: '谢谢参与', weight: 0, color: '#eeeeee' })
    }
    return list
})

const addPrize = () => {
    prizes.value.push({
        name: `奖品 ${prizes.value.length + 1}`,
        weight: 10,
        color: PALETTE[prizes.value.length % PALETTE.length],
    })
}

const removePrize = (index) => {
    prizes.value.splice(index, 1)
    if (form.forcedIndex >= prizes.value.length) {
        form.forcedIndex = -1
    }
}

const pickIndex = () => {
    const list = effectivePrizes.value
    if (form.forcedIndex >= 0 && form.forcedIndex < list.length) {
        return form.forcedIndex
    }
    const total = list.reduce((sum, prize) => sum + weightOf(prize), 0)
    if (total <= 0) {
        return Math.floor(Math.random() * list.length)
    }
    let random = Math.random() * total
    for (let i = 0; i < list.length; i++) {
        random -= weightOf(list[i])
        if (random < 0) return i
    }
    return list.length - 1
}

const luckyRef = ref(null)
const slotRef = ref(null)
const spinning = ref(false)
const lastResult = ref('')

let drawTimer = null
const clearDrawTimer = () => {
    if (drawTimer) {
        window.clearTimeout(drawTimer)
        drawTimer = null
    }
}

// 无限时长模式下不排停止定时器，一直转到用户点停止
const startDraw = () => {
    if (spinning.value) return
    spinning.value = true
    luckyRef.value?.play()
    if (form.infinite) return
    const index = pickIndex()
    drawTimer = window.setTimeout(() => luckyRef.value?.stop(index), form.duration)
}

// 老虎机没有内置按钮，由外部按钮触发；无限时长模式下它旋转中就是「停止」
const startSlotDraw = () => {
    if (spinning.value) {
        if (form.infinite) stopDraw()
        return
    }
    spinning.value = true
    slotRef.value?.play()
    if (form.infinite) return
    const index = pickIndex()
    drawTimer = window.setTimeout(() => slotRef.value?.stop(index), form.duration)
}

// 中奖索引在点停止的这一刻才抽，旋转中改「中奖设置」能立刻生效
const stopDraw = () => {
    const index = pickIndex()
    if (form.type === 'SlotMachine') {
        slotRef.value?.stop(index)
    } else {
        luckyRef.value?.stop(index)
    }
}

const endDraw = (prize) => {
    spinning.value = false
    const name = prize?.fonts?.[0]?.text || ''
    lastResult.value = name
    // 抽奖被判无效时库回调回来的是空对象，这种不算一次结果
    if (name) addRecord(name)
}

const TYPE_LABELS = { LuckyWheel: '大转盘', LuckyGrid: '九宫格', SlotMachine: '老虎机' }
// 封顶，避免 localStorage 无限增长
const MAX_HISTORY = 200

// 倒序存：新记录插在最前面，列表和导出的顺序都是最近一次在最上面
const history = ref(JSON.parse(localStorage.getItem(LOCAL_STORAGE_LOTTERY_HISTORY_KEY)) || [])
const saveHistory = () => {
    localStorage.setItem(LOCAL_STORAGE_LOTTERY_HISTORY_KEY, JSON.stringify(history.value))
}
const addRecord = (prize) => {
    history.value = [{ time: Date.now(), type: form.type, prize }, ...history.value].slice(0, MAX_HISTORY)
    saveHistory()
}
const clearHistory = () => {
    history.value = []
    saveHistory()
}

const showHistory = ref(false)
const timeText = (ms) => dayjs(ms).format('YYYY-MM-DD HH:mm:ss')
const historyColumns = [
    {
        title: '时间', dataIndex: 'time', width: 170,
        customRender: ({ text }) => timeText(text),
    },
    {
        title: '类型', dataIndex: 'type', width: 90,
        customRender: ({ text }) => TYPE_LABELS[text] || text,
    },
    { title: '奖品', dataIndex: 'prize' },
]
// 写成常量而不是模板内联对象：内联的话每次渲染都是新引用，翻页状态可能被重置
const historyPagination = { pageSize: 10, hideOnSinglePage: true }

const exportHistory = () => {
    const rows = [
        ['时间', '类型', '奖品'],
        ...history.value.map((item) => [timeText(item.time), TYPE_LABELS[item.type] || item.type, item.prize]),
    ]
    downloadCSVData(rows, `抽奖记录-${new Date().getTime()}.csv`)
}

watch(() => form.type, () => {
    // 切换类型时取消上一类型尚未触发的 stop，避免误调用新实例
    clearDrawTimer()
    spinning.value = false
    lastResult.value = ''
    if (form.type === 'LuckyGrid' && form.forcedIndex >= GRID_SLOT_COUNT) {
        form.forcedIndex = -1
    }
})

// 无限时长模式下，画布中央的按钮旋转中变成「停止」，它和老虎机的外部按钮是各自的停止入口
const centerButtonText = computed(() => (form.infinite && spinning.value ? '停止' : form.buttonText))

const wheelBlocks = computed(() => [{ padding: fontPx(13, 6), background: '#617df2' }])
const wheelPrizes = computed(() => effectivePrizes.value.map((prize) => ({
    background: prize.color,
    fonts: [{ text: prize.name, fontSize: fontPx(13, 10) }],
})))
const wheelButtons = computed(() => [{
    radius: '35%',
    background: '#8a9bf3',
    pointer: true,
    fonts: [{ text: centerButtonText.value, fontSize: fontPx(14, 11) }],
}])

const gridBlocks = computed(() => [{ padding: fontPx(6, 3), background: '#617df2' }])
const gridPrizes = computed(() => GRID_CELLS.map((cell, index) => ({
    x: cell.x,
    y: cell.y,
    background: effectivePrizes.value[index].color,
    fonts: [{ text: effectivePrizes.value[index].name, fontSize: fontPx(13, 10) }],
})))
const gridButtons = computed(() => [{
    x: 1,
    y: 1,
    background: '#8a9bf3',
    fonts: [{ text: centerButtonText.value, fontSize: fontPx(14, 11) }],
}])

const slotBlocks = computed(() => [{ padding: fontPx(10, 5), background: '#617df2' }])
const slotPrizes = computed(() => effectivePrizes.value.map((prize) => ({
    background: prize.color,
    fonts: [{ text: prize.name, fontSize: fontPx(14, 11) }],
})))
const slotSlots = computed(() => {
    const order = effectivePrizes.value.map((_, index) => index)
    return [{ order: [...order] }, { order: [...order] }, { order: [...order] }]
})

const rightDiv = ref(null)
// 画布实际能用的区域：right 里除工具条以外的那块。ResizeObserver 量的是它，
// 画布尺寸就自动扣掉了工具条占的高度，不会画到按钮身上
const canvasArea = ref(null)
const isFull = ref(false)
// 收起左侧配置后 right 独占整行，ResizeObserver 会收到尺寸变化，画布跟着重算
const configOpen = ref(true)

const toggleFullScreen = () => {
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        rightDiv.value?.requestFullscreen()
    }
}
const handleFullScreenChange = () => {
    isFull.value = !!document.fullscreenElement
}

// @lucky-canvas/vue 只在 mounted 时读一次 width/height，改 props 不会重绘；
// 但核心实例上的 width/height 是响应式的，赋值会触发它自己的 resize + draw
const applyCanvasSize = () => {
    const lucky = luckyRef.value?.lucky || slotRef.value?.lucky
    if (!lucky) return
    const size = canvasSize.value

    if (form.type !== 'SlotMachine') {
        lucky.width = size
        lucky.height = size
        return
    }

    // 老虎机的滚动位置是按旧格子尺寸算出来的像素值，等比换算后才能停回同一个奖格；
    // 它的格子尺寸和离屏画布只有 drawOffscreenCanvas() 会按新尺寸刷新，resize() 里没有这一步
    const ratio = lucky.boxWidth ? size / lucky.boxWidth : 1
    const scaled = (list) => list.map((value) => value * ratio)
    const scroll = scaled(lucky.scroll)
    const stopScroll = scaled(lucky.stopScroll)
    const endScroll = scaled(lucky.endScroll)

    lucky.width = size
    lucky.height = size
    lucky.drawOffscreenCanvas()
    lucky.scroll = scroll
    lucky.stopScroll = stopScroll
    lucky.endScroll = endScroll
    lucky.draw()
}

watch(canvasSize, applyCanvasSize)

// 库的 handleClick 里有 `if (this.step !== 0) return`，旋转中画布中央的按钮点不动，
// 所以自己接一个 click：命中判定照抄库里 handleClick 的写法，只把动作换成停止
const isCenterButtonHit = (lucky, event) => {
    const { ctx } = lucky
    if (form.type === 'LuckyWheel') {
        ctx.beginPath()
        ctx.arc(0, 0, lucky.maxBtnRadius, 0, Math.PI * 2, false)
        return ctx.isPointInPath(event.offsetX, event.offsetY)
    }
    return [...lucky.buttons, lucky.button].some((btn) => {
        if (!btn) return false
        const [x, y, width, height] = lucky.getGeometricProperty([btn.x, btn.y, btn.col || 1, btn.row || 1])
        ctx.beginPath()
        ctx.rect(x, y, width, height)
        return ctx.isPointInPath(event.offsetX, event.offsetY)
    })
}

// 驼在 rightDiv 上做事件委托：不用关心 canvas 节点什么时候被重建，切换类型也不会丢监听。
// 必须用捕获阶段——库的监听挂在 canvas 上，冒泡阶段会比它晚跑，那时候「开始」那次点击已经
// 把 step 从 0 变成 1 了，这里就会把开始的那一下误判成停止
const handleCanvasClick = (event) => {
    if (!form.infinite || event.target.tagName !== 'CANVAS') return
    const lucky = luckyRef.value?.lucky
    if (!lucky || lucky.step === 0) return
    if (isCenterButtonHit(lucky, event)) stopDraw()
}

let resizeObserver = null
onMounted(() => {
    resizeObserver = new ResizeObserver(([entry]) => {
        box.value = { width: entry.contentRect.width, height: entry.contentRect.height }
    })
    resizeObserver.observe(canvasArea.value)
    rightDiv.value.addEventListener('click', handleCanvasClick, true)
    document.addEventListener('fullscreenchange', handleFullScreenChange)
})
onUnmounted(() => {
    clearDrawTimer()
    resizeObserver?.disconnect()
    rightDiv.value?.removeEventListener('click', handleCanvasClick, true)
    document.removeEventListener('fullscreenchange', handleFullScreenChange)
})
</script>

<style lang="scss">
.title {
    font-size: 16px;
    font-weight: 600;
}

.lotteryContainer {
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
        // 全屏时浏览器会给全屏元素铺黑底，显式给成卡片底色
        background: #fff;

        // 占位而不是浮层：工具条先占掉自己的高度，画布只能排在它下面，挤不到也盖不住。
        // flex 项即使不定位也吃 z-index，极窄视口里画布被最小尺寸顶出来时按钮仍在最上层
        .corner-tools {
            flex: none;
            align-self: flex-end;
            z-index: 1;
            display: flex;
            gap: 8px;
        }

        // 画布在剩下的空间里居中；min-height: 0 是必须的，否则内容会把这里顶大、
        // ResizeObserver 量到变大的值、画布又跟着变大，来回震
        .canvas-area {
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
        }

        // 全屏时预览区就是整个屏幕，贴着屏幕边角太挤，往里让一点
        &.right-full {
            padding: 16px;
        }
    }
}

.prize-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 8px;
}

.prize-row {
    display: flex;
    align-items: center;
    gap: 6px;

    .prize-color {
        flex: none;
        width: 28px;
        height: 28px;
        padding: 0;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        background: none;
        cursor: pointer;
    }

    .prize-name {
        flex: auto;
        min-width: 0;
    }

    .prize-weight {
        flex: none;
        width: 80px;
    }

    .prize-percent {
        flex: none;
        width: 52px;
        text-align: right;
        color: #999;
        font-size: 12px;
    }
}

.grid-tip {
    margin-top: 8px;
}

.duration-row {
    display: flex;
    align-items: center;
    gap: 12px;

    .ant-slider {
        flex: auto;
    }
}

.result {
    font-size: var(--lottery-font);

    strong {
        font-size: var(--lottery-font-strong);
        color: #409eff;
    }
}
</style>
