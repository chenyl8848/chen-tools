import useToolStore from "@/store/module/tool"
import { useRoute } from "vue-router"
import { ref } from "vue"

export const useTool = () => {
    const toolStore = useToolStore()
    const $route = useRoute()
    return toolStore.commonTools.find((item) => item.path === $route.path) || {}
}

export const useMobile = () => {
    // 判断是什么设备
    const userAgent = navigator.userAgent.toLowerCase();

    // 判断是否为移动设备
    const isMobile =
        /iphone|ipod|android|ios|ipad|blackberry|webos|symbian|windows phone|phone/i.test(
            userAgent
        )

    return isMobile
}

export const useFullScreen = (container) => {
    const isFullScreen = ref(!!(document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement))

    const fullScreen = () => {
        // 进入全屏
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullScreen) {
            container.webkitRequestFullScreen();
        } else if (container.value.mozRequestFullScreen) {
            container.mozRequestFullScreen();
        } else if (container.msRequestFullscreen) {
            // IE11
            container.msRequestFullscreen();
        }
    }

    const exitFullScreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    const toggleFullScreen = () => {
        if (isFullScreen.value) {
            exitFullScreen();
        } else {
            fullScreen();
        }
    }

    // 监听全屏变化事件
    const handleFullScreenChange = () => {
        isFullScreen.value = !!(document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement)
    }

    // 添加事件监听器
    document.addEventListener('fullscreenchange', handleFullScreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange)
    document.addEventListener('mozfullscreenchange', handleFullScreenChange)
    document.addEventListener('MSFullscreenChange', handleFullScreenChange)

    // 清理事件监听器
    const removeFullScreenListeners = () => {
        document.removeEventListener('fullscreenchange', handleFullScreenChange)
        document.removeEventListener('webkitfullscreenchange', handleFullScreenChange)
        document.removeEventListener('mozfullscreenchange', handleFullScreenChange)
        document.removeEventListener('MSFullscreenChange', handleFullScreenChange)
    }

    return [isFullScreen, fullScreen, exitFullScreen, toggleFullScreen, removeFullScreenListeners]
}