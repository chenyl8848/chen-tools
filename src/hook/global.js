import useToolStore from "@/store/module/tool"
import { useRoute } from "vue-router"

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
        );

    
    return isMobile
}