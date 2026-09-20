<template>
    <a-card :bordered="false">
        <tool-header />

        <div class="workspace">
            <section class="panel-area">
                <a-tabs v-model:activeKey="activeTab" class="workspace-tabs">
                    <a-tab-pane key="result">
                        <template #tab>
                            <span class="tab-label">
                                换算结果
                                <i v-if="titles.length" class="tab-dot" />
                            </span>
                        </template>

                        <div class="panel-grid">
                            <div class="panel panel-primary">
                                <div class="panel-label">我称呼 TA</div>
                                <div class="pill-row">
                                    <span v-for="title in titles" :key="title" class="pill pill-primary">{{ title }}</span>
                                    <span v-if="!words.length" class="panel-empty">先在右边选一段关系</span>
                                    <span v-else-if="!titles.length" class="panel-empty">这段关系没有对应的亲戚称谓</span>
                                </div>
                            </div>

                            <div class="panel">
                                <div class="panel-label">TA 称呼我</div>
                                <div class="pill-row">
                                    <span v-for="title in reverseTitles" :key="title"
                                        class="pill pill-success">{{ title }}</span>
                                    <span v-if="!reverseTitles.length" class="panel-empty">—</span>
                                </div>
                            </div>

                            <div class="panel">
                                <div class="panel-label">TA 眼中的关系链</div>
                                <div class="pill-row">
                                    <span v-for="chain in reverseChains" :key="chain" class="pill">{{ chain }}</span>
                                    <span v-if="!reverseChains.length" class="panel-empty">—</span>
                                </div>
                            </div>
                        </div>

                        <div class="detail-actions">
                            <a-button :disabled="!titles.length" @click="copyResult">
                                <template #icon>
                                    <CopyOutlined />
                                </template>
                                复制结果
                            </a-button>
                            <a-button @click="historyOpen = true">
                                <template #icon>
                                    <HistoryOutlined />
                                </template>
                                计算记录（{{ history.length }}）
                            </a-button>
                        </div>
                    </a-tab-pane>

                    <a-tab-pane key="lookup">
                        <template #tab>
                            <span class="tab-label">
                                按称谓反查
                                <i v-if="chainResults.length" class="tab-dot" />
                            </span>
                        </template>

                        <a-input-search v-model:value="keyword" size="large" allow-clear
                            placeholder="输入一个称谓，看它可能是哪些关系，如：表哥、舅妈、小叔子" />

                        <div v-if="keyword.trim()" class="chain-grid">
                            <button v-for="chain in chainResults" :key="chain" type="button" class="chain-card"
                                @click="loadChain(chain)">
                                <span class="chain-text">{{ chain }}</span>
                                <span class="chain-action">填入计算器</span>
                            </button>
                        </div>

                        <a-empty v-else-if="!keyword.trim()" class="lookup-hint"
                            description="右边先选好「我是男/女」，反查结果会跟着变" />

                        <a-empty v-else class="lookup-hint"
                            description="没查到。同一个称谓在不同性别下对应不同关系，换个说法或切换「我是」再试" />
                    </a-tab-pane>

                    <a-tab-pane key="catalog" tab="亲戚称呼大全">
                        <div class="catalog-flow">
                            <div v-for="category in displayCategories" :key="category.title" class="catalog-group">
                                <div class="catalog-group-title">{{ category.title }}</div>
                                <div class="catalog">
                                    <button v-for="item in category.items" :key="item.title" type="button"
                                        class="catalog-item" @click="pickTitle(item.title)">
                                        {{ item.title }}
                                    </button>
                                </div>
                                <p v-if="!category.items.length" class="panel-empty">
                                    切换成{{ category.sex === 1 ? '男' : '女' }}性后可查
                                </p>
                            </div>
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </section>

            <section class="calculator">
                <div class="screen">
                    <div class="screen-bar">
                        <div class="seg">
                            <span class="seg-label">我是</span>
                            <button v-for="option in SEX_OPTIONS" :key="option.value" type="button"
                                class="seg-item" :class="{ 'seg-item-active': sex === option.value }"
                                @click="sex = option.value">
                                {{ option.label }}
                            </button>
                        </div>
                        <span class="screen-steps">{{ displayWords.length }} 步</span>
                    </div>
                    <div class="screen-expression">
                        <span class="token-self">我</span>
                        <template v-for="(word, index) in displayWords" :key="index">
                            <span class="token-join">的</span>
                            <span class="token-word">{{ word }}</span>
                        </template>
                        <span v-if="!displayWords.length" class="screen-placeholder">按下面的按键选关系</span>
                    </div>
                    <div class="screen-answer" :class="{ 'screen-answer-muted': !titles.length }">
                        {{ answerText || (words.length ? '查不到' : '—') }}
                    </div>
                </div>

                <div class="keypad">
                    <button v-for="key in RELATION_KEYS" :key="key" type="button" class="key"
                        @click="pushWord(key)">
                        {{ key }}
                    </button>
                    <button type="button" class="key key-fn" @click="backspace">退格</button>
                    <button type="button" class="key key-fn" @click="clearAll">清空</button>
                    <button type="button" class="key key-equal" title="把这次结果存进计算记录"
                        :disabled="!titles.length" @click="saveRecord">
                        =
                    </button>
                </div>

                <a-input v-model:value="expression" class="free-input" allow-clear
                    placeholder="也可以直接打字，如：老爸的妈妈" />
            </section>
        </div>

        <a-modal v-model:open="historyOpen" width="60%" centered :title="`计算记录（${history.length} 条）`">
            <a-table :columns="historyColumns" :data-source="history" row-key="key" size="small"
                :pagination="{ pageSize: 8, hideOnSinglePage: true }"
                :locale="{ emptyText: '还没有记录，按键盘上的 = 就能存一条' }" />
            <template #footer>
                <a-popconfirm title="确定清空全部记录？" ok-text="清空" cancel-text="取消" @confirm="clearHistory">
                    <a-button danger :disabled="!history.length">清空</a-button>
                </a-popconfirm>
                <a-button type="primary" @click="historyOpen = false">关闭</a-button>
            </template>
        </a-modal>
    </a-card>
</template>

<script setup>
import { computed, ref } from 'vue'
import { message } from 'ant-design-vue'
import { CopyOutlined, HistoryOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import relationship from 'relationship.js'
import { copyText } from '@/utils/common'

const SEX_OPTIONS = [
    { value: 1, label: '男' },
    { value: 0, label: '女' },
]

const RELATION_KEYS = [
    '爸爸', '妈妈', '老公', '老婆',
    '儿子', '女儿', '哥哥', '弟弟',
    '姐姐', '妹妹', '兄弟', '姐妹',
]

// 亲戚称呼大全的条目，姻亲那两类分男女，查不出来的会在下面提示切换性别
const CATEGORIES = [
    {
        title: '长辈 · 父系',
        items: ['爷爷', '奶奶', '伯父', '伯母', '叔叔', '婶婶', '姑姑', '姑父',
            '堂哥', '堂弟', '堂姐', '堂妹', '姑奶奶', '舅爷爷', '曾祖父', '曾祖母'],
    },
    {
        title: '长辈 · 母系',
        items: ['外公', '外婆', '舅舅', '舅妈', '姨妈', '姨父',
            '表哥', '表弟', '表姐', '表妹', '曾外祖父'],
    },
    {
        title: '平辈',
        items: ['哥哥', '弟弟', '姐姐', '妹妹', '兄弟', '姐妹',
            '嫂子', '弟妹', '姐夫', '妹夫', '堂嫂'],
    },
    {
        title: '晚辈',
        items: ['儿子', '女儿', '儿媳', '女婿', '孙子', '孙女', '外孙', '外孙女',
            '侄子', '侄女', '外甥', '外甥女', '曾孙'],
    },
    {
        title: '姻亲 · 夫家',
        sex: 0,
        items: ['公公', '婆婆', '大伯子', '小叔子', '大姑子', '小姑子', '妯娌'],
    },
    {
        title: '姻亲 · 妻家',
        sex: 1,
        items: ['岳父', '岳母', '大舅子', '小舅子', '大姨子', '小姨子', '连襟'],
    },
]

// 反查结果里的「(男性)」「(女性)」是库对「说话人性别」的限定，界面已经按性别查过了，去掉即可
const SEX_NOTE = /^\([男女]性\)/

const sex = ref(1)
const expression = ref('')
const keyword = ref('')
const activeTab = ref('result')
const historyOpen = ref(false)

const words = computed(() => expression.value.split('的').map((word) => word.trim()).filter(Boolean))
const chainText = computed(() => words.value.join('的'))
// 单独一个「我」就是自己，链上没有这一环，去掉免得显示成「我的我」
const displayWords = computed(() => words.value.filter((word) => word !== '我'))

// 输入框是用户直接编辑的边界，库里遇到解析不了的内容会返回空数组，这里再兜一层异常
const ask = (options) => {
    try {
        return relationship({ sex: sex.value, ...options }) || []
    } catch {
        return []
    }
}

const titles = computed(() => (chainText.value ? ask({ text: chainText.value }) : []))
const reverseTitles = computed(() => (chainText.value ? ask({ text: chainText.value, reverse: true }) : []))
const reverseChains = computed(() => {
    if (!chainText.value) return []
    const list = ask({ text: chainText.value, reverse: true, type: 'chain' })
    return [...new Set(list.map((item) => item.replace(SEX_NOTE, '')))]
})

const answerText = computed(() => titles.value.join(' / '))

const chainResults = computed(() => {
    const text = keyword.value.trim()
    if (!text) return []
    return [...new Set(ask({ text, type: 'chain' }).map((item) => item.replace(SEX_NOTE, '')))]
})

// 姻亲称谓只在自己的性别对得上时才有解，查不出来的直接不给点
const displayCategories = computed(() => CATEGORIES.map((category) => ({
    ...category,
    items: category.items
        .filter((title) => relationship({ text: title, sex: sex.value, type: 'chain' }).length)
        .map((title) => ({ title })),
})))

const pushWord = (word) => {
    expression.value = chainText.value ? `${chainText.value}的${word}` : word
}

const backspace = () => {
    expression.value = words.value.slice(0, -1).join('的')
}

const clearAll = () => {
    expression.value = ''
}

const loadChain = (text) => {
    expression.value = text
    activeTab.value = 'result'
    message.success(`已把「${text}」填进计算器`)
}

const pickTitle = (title) => {
    keyword.value = title
    activeTab.value = 'lookup'
}

const copyResult = () => {
    const reverse = reverseTitles.value.length ? `，TA 称呼我「${reverseTitles.value.join(' / ')}」` : ''
    copyText(`我称呼「${chainText.value}」为「${answerText.value}」${reverse}`)
}

const MAX_HISTORY = 50
// localStorage 是本站存出去的，但用户可能改过或来自更早的版本，读进来补上表格要用的行 key
const history = ref((JSON.parse(localStorage.getItem('relative-history')) || [])
    .map((item, index) => ({ ...item, key: item.key || `legacy-${index}` })))

const saveRecord = () => {
    if (!titles.value.length) return
    history.value = [{
        key: `${Date.now()}-${history.value.length}`,
        time: Date.now(),
        expression: chainText.value,
        title: answerText.value,
        reverse: reverseTitles.value.join(' / ') || '—',
    }, ...history.value].slice(0, MAX_HISTORY)
    localStorage.setItem('relative-history', JSON.stringify(history.value))
    message.success('已存入计算记录')
}

const clearHistory = () => {
    history.value = []
    localStorage.removeItem('relative-history')
}

const historyColumns = [
    { title: '关系链', dataIndex: 'expression' },
    { title: '我称呼 TA', dataIndex: 'title', width: 160 },
    { title: 'TA 称呼我', dataIndex: 'reverse', width: 160 },
    {
        title: '时间', dataIndex: 'time', width: 160,
        customRender: ({ text }) => dayjs(text).format('MM-DD HH:mm:ss'),
    },
]
</script>

<style lang="scss" scoped>
$accent: #1677ff;
$accent-deep: #0958d9;
$accent-soft: #eaf3ff;
$text-sub: #64748b;
$text-muted: #94a3b8;
$line: #eef2f7;

/* 左边 tab 区吃满剩余宽度，右边计算器固定宽度。
   减掉的 280px 是布局头部 64 + 页脚 70 + 内容内边距 40 + 卡片内边距 48 + tool-header 约 60。
   视口偏矮时先落到 min-height，宁可整页滚一点，也不让计算器被压扁。 */
.workspace {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: minmax(0, 1fr);
    gap: 28px;
    height: calc(100vh - 280px);
    min-height: 620px;
}

/* ---------- 计算器 ---------- */
.calculator {
    // 右半边等宽，计算器本身不满铺，在自己那半里居中
    justify-self: center;
    display: flex;
    flex-direction: column;
    width: 400px;
    max-width: 100%;
    padding: 14px;
    border-radius: 20px;
    background: linear-gradient(180deg, #f8fafd 0%, #eef3fb 100%);
    border: 1px solid #e6edf8;
}

.screen {
    // 超出键盘的那部分高度全给显示屏，键盘行高保持不变
    flex: 1;
    min-height: 132px;
    display: flex;
    flex-direction: column;
    padding: 14px 16px 16px;
    border-radius: 15px;
    color: #fff;
    // 右下角一团蓝色光晕，让纯深色块不至于是一块死板的色块
    background:
        radial-gradient(130% 110% at 100% 100%, rgba(22, 119, 255, 0.34) 0%, transparent 62%),
        linear-gradient(160deg, #222c40 0%, #131a27 100%);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07);
    overflow: hidden;
}

.screen-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.seg {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 2px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
}

.seg-label {
    padding: 0 6px 0 10px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
}

.seg-item {
    padding: 4px 14px;
    border: none;
    border-radius: 999px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.65);
    background: transparent;
    cursor: pointer;
    transition: all 0.16s ease;

    &:hover {
        color: #fff;
    }
}

.seg-item-active {
    color: #0b1220;
    background: #fff;
    font-weight: 600;
}

.screen-steps {
    flex: none;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.42);
}

/* auto 把算式和结果顶到屏底，上面留白，像计算器的液晶屏 */
.screen-expression {
    display: flex;
    align-items: center;
    gap: 5px;
    height: 28px;
    margin-top: auto;
    padding-top: 12px;
    overflow-x: auto;
    white-space: nowrap;
    font-size: 15px;

    &::-webkit-scrollbar {
        height: 0;
    }
}

.token-self {
    color: #7cc4ff;
}

.token-join {
    color: rgba(255, 255, 255, 0.3);
}

.token-word {
    color: #ffd98a;
}

.screen-placeholder {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
}

.screen-answer {
    margin-top: 4px;
    text-align: right;
    font-size: 32px;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.02em;
    color: #fff;
    word-break: break-all;
    text-shadow: 0 2px 12px rgba(124, 196, 255, 0.35);
}

.screen-answer-muted {
    color: rgba(255, 255, 255, 0.26);
    font-size: 25px;
    text-shadow: none;
}

/* 键盘不参与拉伸，行高固定，否则屏越大键越扁 */
.keypad {
    flex: none;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 54px);
    gap: 9px;
    margin: 12px 0;
}

.key {
    padding: 0 4px;
    border: 1px solid #e4eaf3;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 500;
    color: #334155;
    background: #fff;
    cursor: pointer;
    transition: transform 0.14s ease, background 0.14s ease, border-color 0.14s ease, box-shadow 0.14s ease;

    &:hover:not(:disabled) {
        color: $accent-deep;
        background: $accent-soft;
        border-color: #bcd9ff;
        transform: translateY(-1px);
        box-shadow: 0 6px 14px -8px rgba(22, 119, 255, 0.6);
    }

    &:active:not(:disabled) {
        transform: scale(0.97);
    }

    &:focus-visible {
        outline: 2px solid $accent;
        outline-offset: 2px;
    }
}

.key-fn {
    color: $text-sub;
    background: #edf1f8;
    border-color: transparent;
    font-size: 14px;
}

.key-equal {
    grid-column: span 2;
    color: #fff;
    border-color: transparent;
    font-size: 20px;
    font-weight: 600;
    background: linear-gradient(135deg, #4b9bff 0%, #1677ff 55%, #0958d9 100%);
    box-shadow: 0 8px 18px -8px rgba(22, 119, 255, 0.85);

    &:hover:not(:disabled) {
        color: #fff;
        border-color: transparent;
        background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%);
    }

    &:disabled {
        color: rgba(255, 255, 255, 0.75);
        background: #c8d6ea;
        box-shadow: none;
        cursor: not-allowed;
    }
}

.free-input {
    flex: none;
}

/* ---------- 左侧 tab 区 ---------- */
.panel-area {
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.workspace-tabs {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;

    :deep(.ant-tabs-nav) {
        flex: none;
        margin-bottom: 20px;
    }

    :deep(.ant-tabs-tab) {
        padding: 10px 4px;
        font-size: 15px;
    }

    /* 面板内容在这一层滚，tab 标题栏始终留在原位 */
    :deep(.ant-tabs-content-holder) {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
    }
}

.tab-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

/* 在别的 tab 上也能看见「有结果了」 */
.tab-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: $accent;
}

.panel-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 14px;
}

.panel {
    padding: 16px 18px;
    border-radius: 14px;
    background: #f9fbfe;
    border: 1px solid $line;
}

.panel-primary {
    background: linear-gradient(135deg, #f2f8ff 0%, #eaf3ff 100%);
    border-color: #d6e7ff;
}

.panel-label {
    margin-bottom: 10px;
    font-size: 13px;
    color: $text-muted;
}

.pill-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.pill {
    display: inline-flex;
    align-items: center;
    padding: 5px 14px;
    border-radius: 999px;
    font-size: 14px;
    color: #334155;
    background: #fff;
    border: 1px solid #e3e9f2;
}

.pill-primary {
    color: $accent-deep;
    background: #fff;
    border-color: #bcd9ff;
    font-weight: 500;
}

.pill-success {
    color: #0f7b52;
    background: #fff;
    border-color: #b7e4ce;
}

.panel-empty {
    font-size: 13px;
    color: $text-muted;
}

.detail-actions {
    display: flex;
    gap: 10px;
    margin-top: 18px;
}

/* ---------- 反查 ---------- */
.chain-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 10px;
    margin-top: 16px;
}

.chain-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    border: 1px solid #e6ecf5;
    border-radius: 12px;
    font-size: 14px;
    text-align: left;
    color: #334155;
    background: #fff;
    cursor: pointer;
    transition: all 0.16s ease;

    &:hover {
        color: $accent-deep;
        background: #f5f9ff;
        border-color: #bcd9ff;
        transform: translateY(-1px);
        box-shadow: 0 8px 18px -12px rgba(22, 119, 255, 0.7);
    }
}

.chain-text {
    min-width: 0;
    word-break: break-all;
}

.chain-action {
    flex: none;
    font-size: 12px;
    color: $text-muted;
}

.chain-card:hover .chain-action {
    color: $accent;
}

.lookup-hint {
    margin-top: 48px;
}

/* ---------- 称呼大全 ---------- */
/* 按列排布，各组不被拆开。用 column-width 而不是 column-count，
   这样栏宽变了列数自己跟着变，不用为每个断点手写一遍 */
.catalog-flow {
    column-width: 190px;
    column-gap: 36px;
}

.catalog-group {
    break-inside: avoid;
    margin-bottom: 22px;
}

.catalog-group-title {
    margin-bottom: 10px;
    font-size: 13px;
    color: $text-muted;
}

.catalog {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.catalog-item {
    padding: 6px 14px;
    border: 1px solid #e6ecf5;
    border-radius: 999px;
    font-size: 14px;
    color: #334155;
    background: #f7fafd;
    cursor: pointer;
    transition: all 0.16s ease;

    &:hover {
        color: $accent-deep;
        background: $accent-soft;
        border-color: #bcd9ff;
    }

    &:active {
        transform: scale(0.97);
    }
}

/* 窄屏并排放不下 tab 区和计算器，改成上下堆叠，这时不再锁高度，让页面正常往下滚 */
@media (max-width: 1100px) {
    .workspace {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        height: auto;
    }

    /* 堆叠后计算器放在最上面，先输入再看结果。
       仍然保持 400px 宽并居中，不铺满，免得又变成一条扁扁的横条 */
    .calculator {
        order: -1;
        height: 620px;
    }
}
</style>
