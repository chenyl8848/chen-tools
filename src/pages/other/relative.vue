<template>
    <a-card :bordered="false">
        <tool-header />

        <div class="workspace">
            <section class="column column-calc">
                <div class="calculator">
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
                </div>
            </section>

            <section class="column column-result">
                <h4 class="column-title">换算结果</h4>
                <div class="panel panel-primary">
                    <div class="panel-label">我称呼 TA</div>
                    <div class="pill-row">
                        <span v-for="title in titles" :key="title" class="pill pill-primary">{{ title }}</span>
                        <span v-if="!words.length" class="panel-empty">先选一段关系</span>
                        <span v-else-if="!titles.length" class="panel-empty">这段关系没有对应的亲戚称谓</span>
                    </div>
                </div>

                <div class="panel">
                    <div class="panel-label">TA 称呼我</div>
                    <div class="pill-row">
                        <span v-for="title in reverseTitles" :key="title" class="pill pill-success">{{ title }}</span>
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

                <div class="detail-actions">
                    <a-button block :disabled="!titles.length" @click="copyResult">
                        <template #icon>
                            <CopyOutlined />
                        </template>
                        复制结果
                    </a-button>
                    <a-button block @click="historyOpen = true">
                        <template #icon>
                            <HistoryOutlined />
                        </template>
                        计算记录（{{ history.length }}）
                    </a-button>
                </div>
            </section>

            <section class="column column-lookup">
                <h4 class="column-title">按称谓反查关系</h4>
                <a-input-search v-model:value="keyword" placeholder="如：表哥、舅妈、小叔子" allow-clear />
                <div v-if="keyword.trim()" class="chain-list">
                    <button v-for="chain in chainResults" :key="chain" type="button" class="chain-row"
                        @click="loadChain(chain)">
                        <span>{{ chain }}</span>
                        <span class="chain-action">填入</span>
                    </button>
                    <p v-if="!chainResults.length" class="panel-empty chain-empty">
                        没查到。性别不同可查到的称谓也不同，换个说法或切换「我是」再试。
                    </p>
                </div>
            </section>

            <section class="column column-catalog">
                <h4 class="column-title">亲戚称呼大全</h4>
                <div v-for="category in displayCategories" :key="category.title" class="catalog-group">
                    <div class="catalog-group-title">{{ category.title }}</div>
                    <div class="catalog">
                        <button v-for="item in category.items" :key="item.title" type="button" class="catalog-item"
                            @click="keyword = item.title">
                            {{ item.title }}
                        </button>
                    </div>
                    <p v-if="!category.items.length" class="panel-empty">
                        切换成{{ category.sex === 1 ? '男' : '女' }}性后可查
                    </p>
                </div>
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
    message.success(`已把「${text}」填进计算器`)
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

/* 四栏并排铺一屏，高度锁在视口内，超出的内容由各栏自己滚动，而不是整页往下跑。
   减掉的 330px 是布局头部、内容内边距、卡片内边距、tool-header 和页脚的高度，
   视口偏矮时会先落到 min-height，那时整页才需要滚动。 */
.workspace {
    display: flex;
    align-items: stretch;
    gap: 18px;
    height: calc(100vh - 330px);
    min-height: 520px;
}

.column {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
}

.column-calc {
    flex: none;
    width: 300px;
    // 键盘按比例撑满这一栏，不需要滚动
    overflow: hidden;
}

.column-result {
    flex: 1.1;
}

.column-lookup {
    flex: 1;
}

.column-catalog {
    flex: 1.15;
}

.column-title {
    flex: none;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 12px;
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;

    &::before {
        content: '';
        width: 3px;
        height: 14px;
        border-radius: 2px;
        background: $accent;
    }
}

/* ---------- 计算器 ---------- */
.calculator {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 12px;
    border-radius: 20px;
    background: linear-gradient(180deg, #f8fafd 0%, #eef3fb 100%);
    border: 1px solid #e6edf8;
}

.screen {
    flex: none;
    padding: 12px 14px 14px;
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
    padding: 0 6px 0 9px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
}

.seg-item {
    padding: 3px 12px;
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

.screen-expression {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 26px;
    margin-top: 10px;
    overflow-x: auto;
    white-space: nowrap;
    font-size: 14px;

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
    margin-top: 2px;
    text-align: right;
    font-size: 27px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: #fff;
    word-break: break-all;
    text-shadow: 0 2px 12px rgba(124, 196, 255, 0.35);
}

.screen-answer-muted {
    color: rgba(255, 255, 255, 0.26);
    font-size: 22px;
    text-shadow: none;
}

.keypad {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, minmax(38px, 1fr));
    gap: 8px;
    margin: 10px 0;
}

.key {
    min-height: 38px;
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

/* ---------- 结果 ---------- */
.panel {
    flex: none;
    padding: 12px 14px;
    border-radius: 12px;
    background: #f9fbfe;
    border: 1px solid $line;

    & + .panel {
        margin-top: 10px;
    }
}

.panel-primary {
    background: linear-gradient(135deg, #f2f8ff 0%, #eaf3ff 100%);
    border-color: #d6e7ff;
}

.panel-label {
    margin-bottom: 8px;
    font-size: 12px;
    color: $text-muted;
}

.pill-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.pill {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 13px;
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
    font-size: 12px;
    color: $text-muted;
}

.detail-actions {
    flex: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
}

/* ---------- 反查 ---------- */
.chain-list {
    flex: none;
    margin-top: 10px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid $line;
}

.chain-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    padding: 10px 14px;
    border: none;
    border-bottom: 1px solid $line;
    font-size: 14px;
    text-align: left;
    color: #334155;
    background: #fff;
    cursor: pointer;
    transition: background 0.14s ease;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: #f5f9ff;
    }

    &:hover .chain-action {
        color: $accent;
    }
}

.chain-action {
    flex: none;
    font-size: 12px;
    color: $text-muted;
    transition: color 0.14s ease;
}

.chain-empty {
    padding: 10px 14px;
}

/* ---------- 称呼大全 ---------- */
.catalog-group {
    & + .catalog-group {
        margin-top: 14px;
    }
}

.catalog-group-title {
    margin-bottom: 8px;
    font-size: 12px;
    color: $text-muted;
}

.catalog {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.catalog-item {
    padding: 5px 12px;
    border: 1px solid #e6ecf5;
    border-radius: 999px;
    font-size: 13px;
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

/* 窄屏铺不下四栏，改成换行排，这时不再锁高度，让页面正常往下滚 */
@media (max-width: 1280px) {
    .workspace {
        flex-wrap: wrap;
        height: auto;
    }

    .column {
        overflow: visible;
    }

    .column-calc {
        width: 300px;
        height: 520px;
    }

    .column-result,
    .column-lookup,
    .column-catalog {
        flex: 1 1 260px;
    }
}
</style>
