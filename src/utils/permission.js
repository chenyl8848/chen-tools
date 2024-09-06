import router from '../router'
import { menus } from './data'
const modules = import.meta.glob('@/**/*.vue')

router.beforeEach(async (to, from, next) => {
    await generateDynamicRoutes(menus)
    console.log(router.getRoutes(), "routesssssssssss")
    // next({ ...to, replace: true });
    next()
})

const generateDynamicRoutes = (menuList) => {
    let routes = []
    menuList.forEach(item => {
        let children = []
        if (item.children && item.children.length > 0) {
            children = generateDynamicRoutes(item.children)
        }
        console.log(children, "childrennnnnnnnnnnnn")
        let route = {
            path: item.path,
            component: modules[`/src${item.component}.vue`],
            children: children.length > 0 ? children: null
        }
        console.log(route, "itemmmmmmmmmm")
        router.addRoute(route)
        routes.push(route)
    })
    // router.push()

    return routes
}