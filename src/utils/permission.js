import router from '../router'
import { getTools } from '@/utils/tools'
const modules = import.meta.glob('@/**/*.vue')

router.beforeEach(async (to, from, next) => {
    next()
})

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