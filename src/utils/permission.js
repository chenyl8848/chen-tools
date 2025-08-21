import router from '../router'
import { getTools } from '@/utils/tools'
const modules = import.meta.glob('@/**/*.vue')
import { start, done } from '@/utils/nprogress'

router.beforeEach((to, from, next) => {
    // 开始进度条
    start()
    next();
});

router.afterEach(() => {
    // 结束进度条
    done()
});

export const initRoutes = () => {
    generateDynamicRoutes(getTools())
}

const generateDynamicRoutes = (menus) => {
    menus.forEach((item) => {
        if (item.children && item.children.length > 0) {
            generateDynamicRoutes(item.children)
        } else {
            let route = {
                path: item.path,
                component: modules[`/src${item.component}.vue`],
            }
            router.addRoute(route)
        }
    })
}