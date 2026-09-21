<template>
    <a-card :bordered="false">
        <tool-header />

        <div class="qrContainer">
            <section class="controls">
                <div class="group">
                    <div class="group-title">内容</div>
                    <div class="chips">
                        <button v-for="item in PRESETS" :key="item.key" type="button" class="chip"
                            :class="{ active: preset === item.key }" @click="preset = item.key">{{ item.label }}</button>
                    </div>

                    <div class="fields">
                        <a-input v-if="preset === 'url'" v-model:value="url" placeholder="https://example.com"
                            allow-clear />
                        <a-textarea v-else-if="preset === 'text'" v-model:value="text" allow-clear
                            :auto-size="{ minRows: 3, maxRows: 6 }" placeholder="写进二维码的任何文字" />
                        <template v-else-if="preset === 'wifi'">
                            <a-input v-model:value="wifi.ssid" addon-before="网名" placeholder="WiFi 名称" allow-clear />
                            <a-input-password v-model:value="wifi.password" addon-before="密码" allow-clear
                                :disabled="wifi.encryption === 'nopass'" placeholder="WiFi 密码" />
                            <div class="inline">
                                <a-select v-model:value="wifi.encryption" :options="WIFI_ENCRYPTIONS"
                                    style="width: 140px" />
                                <a-checkbox v-model:checked="wifi.hidden">隐藏网络</a-checkbox>
                            </div>
                        </template>
                        <template v-else-if="preset === 'vcard'">
                            <a-input v-model:value="vcard.name" addon-before="姓名" placeholder="必填，其余可留空"
                                allow-clear />
                            <a-input v-model:value="vcard.tel" addon-before="电话" placeholder="手机或座机" allow-clear />
                            <a-input v-model:value="vcard.org" addon-before="公司" placeholder="公司 / 部门" allow-clear />
                            <a-input v-model:value="vcard.email" addon-before="邮箱" placeholder="name@example.com"
                                allow-clear />
                            <a-input v-model:value="vcard.url" addon-before="网址" placeholder="https://example.com"
                                allow-clear />
                        </template>
                        <template v-else-if="preset === 'sms'">
                            <a-input v-model:value="sms.tel" addon-before="号码" placeholder="接收方号码" allow-clear />
                            <a-textarea v-model:value="sms.body" allow-clear :auto-size="{ minRows: 2, maxRows: 4 }"
                                placeholder="短信内容，可以留空" />
                        </template>
                        <a-input v-else-if="preset === 'tel'" v-model:value="phone" addon-before="号码"
                            placeholder="要拨打的号码" allow-clear />
                    </div>
                </div>

                <div class="group">
                    <div class="group-title">样式</div>

                    <div class="field">
                        <div class="field-label">
                            容错级别
                            <a-tooltip title="L 最低、H 最高。级别越高越抗污损，码点也越多；加 Logo 后一律按 H 生成">
                                <QuestionCircleOutlined class="hint-icon" />
                            </a-tooltip>
                        </div>
                        <a-segmented v-model:value="correctLevel" :options="LEVELS" block />
                    </div>

                    <div class="field">
                        <div class="field-label">码点大小<span class="field-value">{{ cellSize }} px</span></div>
                        <a-slider v-model:value="cellSize" :min="2" :max="40" />
                    </div>

                    <div class="field">
                        <div class="field-label">四周留白<span class="field-value">{{ padding }} px</span></div>
                        <a-slider v-model:value="padding" :min="0" :max="40" />
                    </div>

                    <div class="field">
                        <div class="field-label">配色</div>
                        <div class="themes">
                            <button v-for="theme in THEMES" :key="theme.key" type="button" class="theme"
                                :class="{ active: theme.key === activeTheme }" @click="applyTheme(theme)">
                                <span class="theme-bar">
                                    <i :style="{ backgroundColor: theme.fg }" />
                                    <i :style="{ backgroundColor: theme.eye }" />
                                    <i :style="{ backgroundColor: theme.bg }" />
                                </span>
                                <span class="theme-label">{{ theme.label }}</span>
                            </button>
                        </div>
                    </div>

                    <div class="field">
                        <div class="colors">
                            <div v-for="item in QR_COLORS" :key="item.key" class="color">
                                <a-popover trigger="click" placement="bottom">
                                    <template #content>
                                        <SketchPicker v-model="colors[item.key]" disable-alpha />
                                    </template>
                                    <button type="button" class="swatch"
                                        :style="{ backgroundColor: colors[item.key] }" :aria-label="item.label" />
                                </a-popover>
                                <span class="color-label">{{ item.label }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="group">
                    <div class="group-head">
                        <div class="group-title">Logo</div>
                        <a-switch v-model:checked="logoOn" size="small" />
                    </div>

                    <template v-if="logoOn">
                        <a-tabs v-model:activeKey="logoMode" size="small" class="logo-tabs">
                            <a-tab-pane key="image" tab="图片">
                                <div class="logo-picker">
                                    <img v-if="logoImage" class="logo-thumb" :src="logoImage.src" alt="logo" />
                                    <div v-else class="logo-thumb logo-thumb-empty">未选图片</div>
                                    <a-upload :show-upload-list="false" accept="image/*" :before-upload="beforeUpload">
                                        <a-button><UploadOutlined />选择图片</a-button>
                                    </a-upload>
                                    <a-button @click="useLogoSource(SITE_LOGO)">用本站图标</a-button>
                                </div>

                                <div class="field">
                                    <div class="field-label">占比<span class="field-value">{{ percent(logoRatio) }}</span>
                                    </div>
                                    <a-slider v-model:value="logoRatio" :min="0.15" :max="0.4" :step="0.01" />
                                </div>

                                <div class="field">
                                    <div class="field-label">形状</div>
                                    <a-segmented v-model:value="logoShape" :options="SHAPES" block />
                                </div>

                                <div class="field">
                                    <div class="field-label">内边距<span class="field-value">{{ percent(logoPad) }}</span>
                                    </div>
                                    <a-slider v-model:value="logoPad" :min="0" :max="0.25" :step="0.01" />
                                </div>
                            </a-tab-pane>

                            <a-tab-pane key="text" tab="文字">
                                <div class="fields">
                                    <a-input v-model:value="logoText.text" placeholder="写在码中间的字" allow-clear />
                                    <a-select v-model:value="logoText.fontFamily" :options="FONTS" />
                                </div>

                                <div class="field">
                                    <div class="field-label">字号<span class="field-value">{{ logoText.fontSize }} px</span>
                                    </div>
                                    <a-slider v-model:value="logoText.fontSize" :min="20" :max="160" />
                                </div>

                                <div class="field">
                                    <div class="field-label">内边距<span class="field-value">{{ logoText.pad }} px</span>
                                    </div>
                                    <a-slider v-model:value="logoText.pad" :min="0" :max="60" />
                                </div>

                                <div class="colors colors-2">
                                    <div v-for="item in TEXT_COLORS" :key="item.key" class="color">
                                        <a-popover trigger="click" placement="bottom">
                                            <template #content>
                                                <SketchPicker v-model="logoText[item.key]" disable-alpha />
                                            </template>
                                            <button type="button" class="swatch"
                                                :style="{ backgroundColor: logoText[item.key] }"
                                                :aria-label="item.label" />
                                        </a-popover>
                                        <span class="color-label">{{ item.label }}</span>
                                    </div>
                                </div>
                            </a-tab-pane>
                        </a-tabs>
                    </template>
                </div>
            </section>

            <section class="stage">
                <div class="qr-box">
                    <QRCanvas v-if="qrData" :options="options" @updated="onPreviewUpdated" />
                    <a-empty v-else :description="PLACEHOLDER[preset]" />
                </div>

                <div class="stage-meta">
                    <span v-if="qrData">
                        {{ renderedSize.width }} × {{ renderedSize.height }} px ·
                        {{ moduleCount }} × {{ moduleCount }} 模块 ·
                        容错 {{ correctLevel }}<template v-if="logoOn">（实为 H）</template>
                    </span>
                    <span v-else>左边填好内容，这里出码</span>
                </div>

                <div class="stage-actions">
                    <a-segmented v-model:value="exportScale" :options="EXPORT_SCALES" />
                    <a-button type="primary" :disabled="!qrData" @click="downloadImage">
                        <template #icon>
                            <DownloadOutlined />
                        </template>
                        下载 PNG
                    </a-button>
                    <a-button :disabled="!qrData" @click="copyImage">
                        <template #icon>
                            <CopyOutlined />
                        </template>
                        复制图片
                    </a-button>
                    <a-button :disabled="!qrData" @click="copyContent">
                        <template #icon>
                            <SnippetsOutlined />
                        </template>
                        复制内容
                    </a-button>
                    <a-button @click="resetAll">
                        <template #icon>
                            <RedoOutlined />
                        </template>
                        重置
                    </a-button>
                </div>
            </section>
        </div>

        <!-- 隐藏的导出渲染器：按 exportScale 放大码点重画一遍再取画布，
             比把预览图拉伸放大清晰，Logo 也不会糊 -->
        <QRCanvas class="export-canvas" :options="exportOptions" @updated="onExportUpdated" />
    </a-card>
</template>

<script setup>
import { computed, reactive, ref, shallowRef } from 'vue'
import { message } from 'ant-design-vue'
import {
    CopyOutlined, DownloadOutlined, QuestionCircleOutlined, RedoOutlined,
    SnippetsOutlined, UploadOutlined,
} from '@ant-design/icons-vue'
import { QRCanvas } from 'qrcanvas-vue'
import { SketchPicker } from 'vue-color'
import { copyText, downloadBase64Image } from '@/utils/common'

const PRESETS = [
    { key: 'url', label: '网址' },
    { key: 'text', label: '文本' },
    { key: 'wifi', label: 'WiFi' },
    { key: 'vcard', label: '名片' },
    { key: 'sms', label: '短信' },
    { key: 'tel', label: '电话' },
]

const PLACEHOLDER = {
    url: '输入一个网址',
    text: '输入要写进二维码的文字',
    wifi: '填上网名（SSID）就能生成',
    vcard: '填上姓名就能生成',
    sms: '填上接收方号码',
    tel: '填上要拨打的号码',
}

/* 颜色放在 reactive 对象里、模板用 colors[item.key] 取：数组元素里塞 ref 在模板里不会自动解包 */
const QR_COLORS = [
    { key: 'fg', label: '码点' },
    { key: 'eye', label: '定位框' },
    { key: 'eyeInner', label: '定位心' },
    { key: 'bg', label: '底色' },
]

const TEXT_COLORS = [
    { key: 'color', label: '文字' },
    { key: 'padColor', label: '底色' },
]

const LEVELS = [
    { label: 'L', value: 'L' },
    { label: 'M', value: 'M' },
    { label: 'Q', value: 'Q' },
    { label: 'H', value: 'H' },
]

const SHAPES = [
    { label: '方形', value: 'square' },
    { label: '圆角', value: 'rounded' },
    { label: '圆形', value: 'circle' },
]

const EXPORT_SCALES = [
    { label: '1×', value: 1 },
    { label: '2×', value: 2 },
    { label: '4×', value: 4 },
]

const WIFI_ENCRYPTIONS = [
    { label: 'WPA/WPA2', value: 'WPA' },
    { label: 'WEP', value: 'WEP' },
    { label: '无密码', value: 'nopass' },
]

const FONTS = [
    { label: '黑体', value: 'sans-serif' },
    { label: '衬线', value: 'serif' },
    { label: '等宽', value: 'monospace' },
    { label: '楷体', value: "'KaiTi', 'STKaiti', 楷体" },
]

// 定位角分两层上色：外圈 7×7 和中心 3×3，中间那圈亮色靠底色透出来（qrcanvas 会按码点蒙版裁掉多余部分）
const EYE_FRAMES = [
    { row: 0, rows: 7, col: 0, cols: 7 },
    { row: -7, rows: 7, col: 0, cols: 7 },
    { row: 0, rows: 7, col: -7, cols: 7 },
]
const EYE_CENTERS = [
    { row: 2, rows: 3, col: 2, cols: 3 },
    { row: -5, rows: 3, col: 2, cols: 3 },
    { row: 2, rows: 3, col: -5, cols: 3 },
]

const THEMES = [
    { key: 'classic', label: '经典黑白', fg: '#000000', eye: '#000000', eyeInner: '#000000', bg: '#ffffff' },
    { key: 'blue', label: '科技蓝', fg: '#0b3d91', eye: '#1677ff', eyeInner: '#1677ff', bg: '#ffffff' },
    { key: 'green', label: '墨绿', fg: '#12563c', eye: '#1f9d6b', eyeInner: '#1f9d6b', bg: '#ffffff' },
    { key: 'red', label: '中国红', fg: '#8c1d18', eye: '#d4380d', eyeInner: '#d4380d', bg: '#fff7f6' },
    { key: 'dark', label: '暗色', fg: '#e8eef7', eye: '#ffffff', eyeInner: '#ffffff', bg: '#11161d' },
]

const DEFAULT_URL = 'https://chencoding.top:8090/#/'
const SITE_LOGO = '/images/logo.ico'
// 合成贴图时的最长边上限，避免用户丢进来一张几千像素的照片白占内存
const MAX_LOGO_PIXELS = 1024

// ---------- 内容 ----------
const preset = ref('url')
const url = ref(DEFAULT_URL)
const text = ref('')
const wifi = reactive({ ssid: '', password: '', encryption: 'WPA', hidden: false })
const vcard = reactive({ name: '', tel: '', org: '', email: '', url: '' })
const sms = reactive({ tel: '', body: '' })
const phone = ref('')

// WiFi 载荷用 ; : , \ " 分隔字段，出现在网名或密码里必须转义，否则扫码器会解析错位
const escapeWifi = (value) => String(value).trim().replace(/([\\;,:"])/g, '\\$1')
const escapeVCard = (value) => String(value).trim().replace(/([\\;,])/g, '\\$1').replace(/\r?\n/g, '\\n')

const qrData = computed(() => {
    switch (preset.value) {
        case 'url':
            return url.value.trim()
        case 'text':
            return text.value
        case 'wifi': {
            if (!wifi.ssid.trim()) return ''
            const password = wifi.encryption === 'nopass' ? '' : `P:${escapeWifi(wifi.password)};`
            const hidden = wifi.hidden ? 'H:true;' : ''
            return `WIFI:T:${wifi.encryption};S:${escapeWifi(wifi.ssid)};${password}${hidden};`
        }
        case 'vcard': {
            if (!vcard.name.trim()) return ''
            const lines = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                `N:${escapeVCard(vcard.name)}`,
                `FN:${escapeVCard(vcard.name)}`,
            ]
            if (vcard.org.trim()) lines.push(`ORG:${escapeVCard(vcard.org)}`)
            if (vcard.tel.trim()) lines.push(`TEL;TYPE=CELL:${vcard.tel.trim()}`)
            if (vcard.email.trim()) lines.push(`EMAIL:${vcard.email.trim()}`)
            if (vcard.url.trim()) lines.push(`URL:${vcard.url.trim()}`)
            lines.push('END:VCARD')
            return lines.join('\n')
        }
        case 'sms':
            return sms.tel.trim() ? `SMSTO:${sms.tel.trim()}:${sms.body}` : ''
        case 'tel':
            return phone.value.trim() ? `tel:${phone.value.trim()}` : ''
        default:
            return ''
    }
})

// ---------- 样式 ----------
const correctLevel = ref('H')
const cellSize = ref(10)
const padding = ref(10)
const colors = reactive({
    fg: '#000000',
    eye: '#000000',
    eyeInner: '#000000',
    bg: '#ffffff',
})

const activeTheme = computed(() => THEMES.find((theme) => theme.fg === colors.fg
    && theme.eye === colors.eye
    && theme.eyeInner === colors.eyeInner
    && theme.bg === colors.bg)?.key || '')

const applyTheme = (theme) => {
    Object.assign(colors, { fg: theme.fg, eye: theme.eye, eyeInner: theme.eyeInner, bg: theme.bg })
}

// ---------- Logo ----------
const logoOn = ref(false)
const logoMode = ref('image')
const logoImage = shallowRef(null)
const logoRatio = ref(0.3)
const logoShape = ref('rounded')
const logoPad = ref(0.08)
const logoText = reactive({
    text: '',
    fontFamily: 'sans-serif',
    fontSize: 60,
    pad: 12,
    color: '#000000',
    padColor: '#ffffff',
})

// 先把 Logo 合成进一张方形贴图（底板 + 形状 + 内边距），再整张贴进二维码，
// 这样形状和内边距只在这里处理一次，qrcanvas 那边只管缩放
const logoSprite = computed(() => {
    const image = logoImage.value
    if (!image || !image.naturalWidth) return null
    const base = Math.min(MAX_LOGO_PIXELS, Math.max(image.naturalWidth, image.naturalHeight))
    const pad = Math.round(base * logoPad.value)
    const side = base + pad * 2
    const canvas = document.createElement('canvas')
    canvas.width = side
    canvas.height = side
    const ctx = canvas.getContext('2d')
    // 底板取二维码底色：浅底时和背景连成一片，深底时也不会突兀地多出一块白
    ctx.fillStyle = colors.bg
    ctx.beginPath()
    if (logoShape.value === 'circle') {
        ctx.arc(side / 2, side / 2, side / 2, 0, Math.PI * 2)
    } else if (logoShape.value === 'rounded') {
        ctx.roundRect(0, 0, side, side, side * 0.16)
    } else {
        ctx.rect(0, 0, side, side)
    }
    ctx.fill()
    ctx.save()
    ctx.clip()
    const scale = Math.min(base / image.naturalWidth, base / image.naturalHeight)
    const width = image.naturalWidth * scale
    const height = image.naturalHeight * scale
    ctx.drawImage(image, pad + (base - width) / 2, pad + (base - height) / 2, width, height)
    ctx.restore()
    return canvas
})

// cell 是这一版要用的码点大小：Logo 的像素位置得跟着它算，导出放大时才不会缩成一小块
const buildLogoLayer = (cell) => {
    if (!logoOn.value) return null
    if (logoMode.value === 'text') {
        const value = logoText.text.trim()
        if (!value) return null
        return {
            text: value,
            options: {
                fontSize: logoText.fontSize,
                pad: logoText.pad,
                color: logoText.color,
                padColor: logoText.padColor,
                fontFamily: logoText.fontFamily,
                mode: 1,
            },
        }
    }
    const sprite = logoSprite.value
    if (!sprite) return null
    // 尺寸位置只能给绝对像素：qrcanvas 画 logo 那次调用没带 cellSize，
    // 用 col/cols 这种模块单位会算出 NaN，最后落到整张画布上，Logo 会把整个码盖住
    const count = moduleCount.value
    if (!count) return { image: sprite }
    const side = count * cell
    const width = Math.round(side * logoRatio.value)
    const offset = Math.round((side - width) / 2)
    return { image: sprite, w: width, h: width, x: offset, y: offset }
}

const loadLogo = (src) => new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('load failed'))
    image.src = src
})

// 必须等图片解码完再交给 qrcanvas，否则它读到的是 0×0，算出来的位置是 NaN，Logo 直接不画
const useLogoSource = async (src) => {
    try {
        logoImage.value = await loadLogo(src)
        logoMode.value = 'image'
    } catch {
        message.error('这张图片读不出来，换个格式再试')
    }
}

const beforeUpload = (file) => {
    const reader = new FileReader()
    reader.onload = (event) => useLogoSource(event.target.result)
    reader.onerror = () => message.error('文件读取失败')
    reader.readAsDataURL(file)
    return false
}

// ---------- 渲染与导出 ----------
const moduleCount = ref(0)
const renderedSize = ref({ width: 0, height: 0 })

const buildOptions = (cell, pad) => {
    const logo = buildLogoLayer(cell)
    return {
        data: qrData.value,
        cellSize: cell,
        padding: pad,
        correctLevel: correctLevel.value,
        background: colors.bg,
        foreground: [
            { style: colors.fg },
            ...EYE_FRAMES.map((item) => ({ ...item, style: colors.eye })),
            ...EYE_CENTERS.map((item) => ({ ...item, style: colors.eyeInner })),
        ],
        ...(logo ? { logo } : {}),
    }
}

// 每次依赖变化都返回新对象，qrcanvas-vue 靠 options 的引用变化重绘，
// 直接改嵌套属性（比如原来的定位角颜色）它是收不到的
const options = computed(() => buildOptions(cellSize.value, padding.value))

const onPreviewUpdated = (canvas) => {
    // 画布边长 = 模块数 × 码点 + 两侧留白，反推模块数给 Logo 占比用
    const count = Math.round((canvas.width - padding.value * 2) / cellSize.value)
    if (count > 0 && count !== moduleCount.value) moduleCount.value = count
    if (canvas.width !== renderedSize.value.width || canvas.height !== renderedSize.value.height) {
        renderedSize.value = { width: canvas.width, height: canvas.height }
    }
}

const exportScale = ref(2)
const exportOptions = ref({ data: ' ', cellSize: 10 })
let pendingExport = null

// 留白和 Logo 都按倍数一起放大，导出的图和预览看到的是同一个比例
const renderAtScale = (scale) => new Promise((resolve) => {
    pendingExport = resolve
    exportOptions.value = buildOptions(cellSize.value * scale, padding.value * scale)
})

const onExportUpdated = (canvas) => {
    const resolve = pendingExport
    pendingExport = null
    if (resolve) resolve(canvas)
}

const canvasToBlob = (canvas) => new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))

const exportFileName = () => {
    // 只有网址和文本用内容起名；WiFi 密码、名片信息不该出现在文件名里
    const slug = ['url', 'text'].includes(preset.value)
        ? qrData.value.toLowerCase().replace(/^[a-z]+:\/\//, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        : preset.value
    return `qr-${slug.slice(0, 40) || preset.value}-${Date.now()}.png`
}

const downloadImage = async () => {
    const canvas = await renderAtScale(exportScale.value)
    downloadBase64Image(canvas.toDataURL('image/png'), exportFileName())
    message.success(`已导出 ${canvas.width} × ${canvas.height} 图片`)
}

const copyImage = async () => {
    if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
        message.warning('这个浏览器不支持复制图片，先下载吧')
        return
    }
    const canvas = await renderAtScale(exportScale.value)
    try {
        const blob = await canvasToBlob(canvas)
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        message.success('图片已复制，可以直接粘贴')
    } catch {
        message.error('复制失败，可能是浏览器没给剪贴板权限')
    }
}

const copyContent = () => copyText(qrData.value)

const resetAll = () => {
    preset.value = 'url'
    url.value = DEFAULT_URL
    text.value = ''
    phone.value = ''
    Object.assign(wifi, { ssid: '', password: '', encryption: 'WPA', hidden: false })
    Object.assign(vcard, { name: '', tel: '', org: '', email: '', url: '' })
    Object.assign(sms, { tel: '', body: '' })
    Object.assign(logoText, { text: '', fontFamily: 'sans-serif', fontSize: 60, pad: 12, color: '#000000', padColor: '#ffffff' })
    correctLevel.value = 'H'
    cellSize.value = 10
    padding.value = 10
    applyTheme(THEMES[0])
    logoOn.value = false
    logoMode.value = 'image'
    logoImage.value = null
    logoRatio.value = 0.3
    logoShape.value = 'rounded'
    logoPad.value = 0.08
    exportScale.value = 2
    message.success('已恢复默认设置')
}

const percent = (value) => `${Math.round(value * 100)}%`
</script>

<style lang="scss" scoped>
$accent: #1677ff;
$accent-deep: #0958d9;
$accent-soft: #eaf3ff;
$line: #eef2f7;
$text-sub: #475569;
$text-muted: #94a3b8;

/* 左边参数区吃满剩余空间自己滚，右边预览固定不动。
   减掉的 270px 是布局头尾和卡片内边距，按 confetti 那页的算法保持一致 */
.qrContainer {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 28px;
    height: calc(100vh - 270px);
    min-height: 560px;
}

.controls {
    min-width: 0;
    overflow-y: auto;
    padding-right: 8px;
}

.group {
    margin-bottom: 18px;
    padding-bottom: 18px;
    border-bottom: 1px dashed #e8edf4;
}

.group:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: 0;
}

.group-title {
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
}

.group-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .group-title {
        margin-bottom: 0;
    }
}

/* ---------- 内容 ---------- */
.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
}

.chip {
    padding: 4px 14px;
    border: 1px solid #e3e9f2;
    border-radius: 999px;
    font-size: 13px;
    color: $text-sub;
    background: #f8fafd;
    cursor: pointer;
    transition: all 0.16s ease;

    &:hover {
        color: $accent-deep;
        border-color: #bcd9ff;
    }

    &.active {
        color: $accent-deep;
        background: $accent-soft;
        border-color: #bcd9ff;
        font-weight: 500;
    }
}

.fields {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.inline {
    display: flex;
    align-items: center;
    gap: 12px;
}

/* ---------- 样式 ---------- */
.field {
    margin-bottom: 16px;

    &:last-child {
        margin-bottom: 0;
    }
}

.field-label {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    font-size: 13px;
    color: $text-sub;
}

.field-value {
    margin-left: auto;
    color: $text-muted;
    font-variant-numeric: tabular-nums;
}

.hint-icon {
    color: $text-muted;
}

.themes {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
}

/* 原生 button：要的是一条无内边距的色带，且 a-form 会渲染成 form，
   按钮的 type 必须显式写 button 才不会触发提交 */
.theme {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
}

.theme-bar {
    display: flex;
    width: 100%;
    height: 22px;
    overflow: hidden;
    border: 1px solid #d9d9d9;
    border-radius: 6px;

    i {
        flex: 1;
    }
}

.theme-label {
    font-size: 11px;
    color: $text-muted;
}

.theme.active {
    .theme-bar {
        border-color: $accent;
        box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2);
    }

    .theme-label {
        color: $accent-deep;
    }
}

.colors {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

.colors-2 {
    grid-template-columns: repeat(2, 1fr);
}

.color {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.swatch {
    width: 100%;
    height: 32px;
    padding: 0;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    cursor: pointer;
}

.color-label {
    font-size: 12px;
    color: $text-muted;
}

/* ---------- Logo ---------- */
.logo-picker {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 16px;
}

.logo-thumb {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    object-fit: contain;
    border: 1px solid $line;
    border-radius: 10px;
    background: #f8fafd;
}

.logo-thumb-empty {
    font-size: 11px;
    color: $text-muted;
}

/* ---------- 预览 ---------- */
.stage {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
}

.qr-box {
    flex: 1;
    min-height: 0;
    display: grid;
    place-items: center;
    padding: 24px;
    border-radius: 16px;
    background: #f6f8fb;
    border: 1px solid $line;
}

.qr-box :deep(canvas) {
    /* 码点小的时候不放大、码点大的时候不撑破容器，最近邻缩放保证边缘不发虚 */
    max-width: 100%;
    max-height: 100%;
    border-radius: 6px;
    image-rendering: pixelated;
}

.stage-meta {
    font-size: 13px;
    color: $text-muted;
    text-align: center;
    font-variant-numeric: tabular-nums;
}

.stage-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
}

.export-canvas {
    display: none;
}

@media (max-width: 1100px) {
    .qrContainer {
        grid-template-columns: minmax(0, 1fr);
        height: auto;
    }

    /* 堆叠后预览放最上面，改参数能立刻看见效果 */
    .stage {
        order: -1;
    }

    .qr-box {
        min-height: 320px;
    }

    .controls {
        overflow: visible;
        padding-right: 0;
    }
}
</style>
