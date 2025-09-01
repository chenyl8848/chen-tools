import useToolStore from "@/store/module/tool"
import { useRoute } from "vue-router"

export const useTool = () => {
    const toolStore = useToolStore()
    const $route = useRoute()
    return toolStore.commonTools.find((item) => item.path === $route.path) || {}
}