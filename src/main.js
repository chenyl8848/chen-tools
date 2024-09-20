import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import router from '@/router'
import 'ant-design-vue/dist/reset.css'
import * as Icons from '@ant-design/icons-vue'
import { initRoutes } from '@/utils/permission'

import { createFromIconfontCN } from '@ant-design/icons-vue'
const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4676471_rx2tbkemxxi.js'
})

import store from './store'

const app = createApp(App)
// app.use(router)
// app.use(Antd)

// Object.keys(Icons).forEach((key) => {
//     if (key === 'default') return
//     const Icon = Icons[key]
//     app.component(key, Icon)
// })
// app.component('IconFont', IconFont)


// app.mount('#app')

const startApp = async () => {
    await initRoutes()
    // const app = createApp(App)
    app.use(router)
    app.use(Antd)
    
    Object.keys(Icons).forEach((key) => {
        if (key === 'default') return
        const Icon = Icons[key]
        app.component(key, Icon)
    })
    app.component('IconFont', IconFont)
    
    app.use(store)
    app.mount('#app')
}

startApp()

