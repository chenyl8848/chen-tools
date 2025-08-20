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