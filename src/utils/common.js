import { useClipboard } from '@vueuse/core'
import { message } from 'ant-design-vue'

export const copyText = (text) => {
    const { copy, isSupported } = useClipboard({ text })
    if (isSupported) {
        copy(text)
        message.success('复制成功！')
    } else {
        message.error('您的浏览器不支持 Clipboard API')
    }
}

export const transferred = (str, reg = "`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）;—|【】‘；：”“'。，、？") => {
    let pattern = new RegExp("[" + reg + "]")
    let res = ''
    Array.from(str).forEach((char) => {
        res += char.replace(pattern, `\\${char}`)
    })
    return res
}

export const downloadBase64Image = (base64Data, filename = 'download.png') => {
    const byteString = atob(base64Data.split(',')[1])
    const mimeType = base64Data.match(/:(.*?);/)[1]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([ab], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 100)
}

export const downloadJSONData = (jsonData, fileName = 'data.json') => {
    const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
}