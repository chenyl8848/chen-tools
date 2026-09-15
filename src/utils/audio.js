// 项目里没有任何音频资源，fireworks-js 默认的 sound.files 是 ["explosion0.mp3", ...]，
// 会按站点根目录去取（404）。这里直接合成爆炸声，转成 blob URL 喂给它：
// 库内部对每个 file 走 fetch + decodeAudioData，blob URL 同样适用，且不依赖网络。

const SAMPLE_RATE = 22050
const DURATION = 0.9
const SEEDS = [1, 7, 13]

// 线性同余伪随机：噪声要随机数，但用固定种子让每次生成的波形一致，便于复现和比较
const createRandom = (seed) => () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
}

// 一阶低通滤波器的系数，截止频率越低声音越闷
const lowpassCoefficient = (cutoff) => 1 - Math.exp(-2 * Math.PI * cutoff / SAMPLE_RATE)

const createExplosionSamples = (seed) => {
    const random = createRandom(seed)
    const length = Math.floor(SAMPLE_RATE * DURATION)
    const samples = new Float32Array(length)
    let crack = 0
    let boom = 0

    for (let i = 0; i < length; i++) {
        const t = i / SAMPLE_RATE
        const noise = random() * 2 - 1

        // 脆响：截止频率从 6kHz 一路滑到 120Hz，开头是「炸」的高频，收尾只剩沙沙声
        crack += (noise - crack) * lowpassCoefficient(6000 * Math.exp(-t * 9) + 120)
        // 闷响：固定压到 90Hz 以下，衰减慢得多，当爆炸的余韵
        boom += (noise - boom) * lowpassCoefficient(90)

        // 55Hz 正弦是「轰」的那一下，脆响和闷响各自乘上指数包络
        const thump = Math.sin(2 * Math.PI * 55 * t) * Math.exp(-t * 9) * 0.35
        // 闷响经过低通后振幅很小，放大 5 倍才和脆响一个量级
        samples[i] = crack * Math.exp(-t * 9) + (boom * 5 * Math.exp(-t * 2.8) + thump) * 0.6
    }

    // 归一化到 0.95，避免削顶失真
    let peak = 0
    for (const sample of samples) {
        peak = Math.max(peak, Math.abs(sample))
    }
    const gain = peak > 0 ? 0.95 / peak : 1
    return samples.map((sample) => sample * gain)
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

export const createExplosionWav = (seed) => encodeWav(createExplosionSamples(seed))

// 返回多个变体：库每次爆炸从 files 里随机挑一个，单一音色听多了会发假
export const createExplosionSoundUrls = () => SEEDS.map((seed) =>
    URL.createObjectURL(new Blob([createExplosionWav(seed)], { type: 'audio/wav' }))
)
