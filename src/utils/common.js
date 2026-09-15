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

// rows 是二维数组，第一行当表头；每个单元格都用双引号包起来并转义内部引号，逗号和换行不会串列
export const downloadCSVData = (rows, fileName = 'data.csv') => {
    const csv = rows
        .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\r\n')
    // 前置 BOM，否则 Excel 按本地编码解析，中文会乱码
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 100)
}