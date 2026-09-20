// 项目里没有任何音频资源，fireworks-js 默认的 sound.files 是 ["explosion0.mp3", ...]，
// 会按站点根目录去取（404）。这里直接合成爆炸声，转成 blob URL 喂给它：
// 库内部对每个 file 走 fetch + decodeAudioData，blob URL 同样适用，且不依赖网络。
//
// 合成思路照着真实礼花弹的声学结构拆：极短的药壳爆裂 → 中低频主爆响 → 次低频冲击 → 长余韵。
// 四层各自独立的滤波和包络，混起来才不像一声「啪」。

const SAMPLE_RATE = 22050
// 真实礼花弹的余韵能拖一两秒，太短就只剩「啪」而不是「轰」
const DURATION = 2.2
// 收尾必须淡出，直接截断会留下一声爆音
const FADE_OUT = 0.18

// 三个变体当作三颗大小不同的弹：size 越大主频越低、衰减越慢
const VARIANTS = [
    { seed: 1, size: 0.85 },
    { seed: 7, size: 1 },
    { seed: 13, size: 1.25 },
]

// 线性同余伪随机：噪声要随机数，但用固定种子让每次生成的波形一致，便于复现和比较
const createRandom = (seed) => () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
}

// 一阶低通滤波器的系数，截止频率越低声音越闷
const lowpassCoefficient = (cutoff) => 1 - Math.exp(-2 * Math.PI * cutoff / SAMPLE_RATE)

const createExplosionSamples = (seed, size) => {
    const random = createRandom(seed)
    const length = Math.floor(SAMPLE_RATE * DURATION)
    const fadeStart = length - Math.floor(SAMPLE_RATE * FADE_OUT)
    const samples = new Float32Array(length)

    const subFreq = 54 / size
    const bodyDecay = 0.3 * size
    const subDecay = 0.42 * size
    const tailDecay = 0.62 * size

    let crack = 0
    let body = 0
    let tail = 0
    let phase = 0

    for (let i = 0; i < length; i++) {
        const t = i / SAMPLE_RATE
        const noise = random() * 2 - 1

        // 药壳炸开：截止频率从 9kHz 一路滑到 400Hz，只响几十毫秒，是「脆」的来源
        crack += (noise - crack) * lowpassCoefficient(9000 * Math.exp(-t * 14) + 400)
        // 主爆响：240Hz 滑到 70Hz，「轰」的厚度主要靠它
        body += (noise - body) * lowpassCoefficient(240 * Math.exp(-t * 3) + 70)
        // 余韵：恒定压到 140Hz 以下，衰减最慢，是爆炸过后那阵呼呼声
        tail += (noise - tail) * lowpassCoefficient(140)

        // 次低频：胸腔能感到的那一下，频率随时间下滑比定频正弦更像爆炸。
        // 4ms 的起振是必要的，瞬间起跳会让扬声器「啪」一声
        phase += 2 * Math.PI * subFreq * (1 - 0.22 * (1 - Math.exp(-t * 6))) / SAMPLE_RATE
        const sub = Math.sin(phase) * Math.min(1, t / 0.004) * Math.exp(-t / subDecay)

        samples[i] =
            crack * Math.exp(-t * 22) * 0.85 +
            body * Math.exp(-t / bodyDecay) * 2.4 +
            // 余韵延后 60ms 左右进场，让主爆响先立住
            tail * (1 - Math.exp(-t * 16)) * Math.exp(-t / tailDecay) * 3.2 +
            sub * 0.6
    }

    // 软削波当限幅器用：峰值由最尖的瞬态决定，不压一下主体会被峰值挤得听不见
    let peak = 0
    for (let i = 0; i < length; i++) {
        samples[i] = Math.tanh(samples[i] * 1.6)
        peak = Math.max(peak, Math.abs(samples[i]))
    }

    // 归一化到 0.95 避免削顶失真，末尾线性淡出
    const gain = peak > 0 ? 0.95 / peak : 1
    for (let i = 0; i < length; i++) {
        samples[i] *= gain * (i < fadeStart ? 1 : (length - i) / (length - fadeStart))
    }

    return samples
}

const encodeWav = (samples) => {
    const bytes = new ArrayBuffer(44 + samples.length * 2)
    const view = new DataView(bytes)
    const writeText = (offset, text) => {
        for (let i = 0; i < text.length; i++) {
            view.setUint8(offset + i, text.charCodeAt(i))
        }
    }

    writeText(0, 'RIFF')
    view.setUint32(4, 36 + samples.length * 2, true)
    writeText(8, 'WAVE')
    writeText(12, 'fmt ')
    view.setUint32(16, 16, true)                    // fmt 块长度
    view.setUint16(20, 1, true)                     // PCM
    view.setUint16(22, 1, true)                     // 单声道
    view.setUint32(24, SAMPLE_RATE, true)           // 采样率
    view.setUint32(28, SAMPLE_RATE * 2, true)       // 字节率
    view.setUint16(32, 2, true)                     // 块对齐
    view.setUint16(34, 16, true)                    // 位深
    writeText(36, 'data')
    view.setUint32(40, samples.length * 2, true)

    samples.forEach((sample, index) => {
        view.setInt16(44 + index * 2, Math.round(Math.max(-1, Math.min(1, sample)) * 32767), true)
    })

    return bytes
}

export const createExplosionWav = (seed, size) => encodeWav(createExplosionSamples(seed, size))

// 返回多个变体：库每次爆炸从 files 里随机挑一个，单一音色听多了会发假
export const createExplosionSoundUrls = () => VARIANTS.map(({ seed, size }) =>
    URL.createObjectURL(new Blob([createExplosionWav(seed, size)], { type: 'audio/wav' }))
)
