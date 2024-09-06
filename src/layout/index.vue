<template>
    <a-layout style="min-height: 100vh">
        <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
            <sidebar></sidebar>
        </a-layout-sider>
        <a-layout>
            <a-layout-header>
                <navbar @collapseMenu="collapsed = !collapsed"></navbar>
            </a-layout-header>
            <a-layout-content>
                <router-view></router-view>
            </a-layout-content>
            <a-layout-footer style="text-align: center">
                Ant Design ©2018 Created by Ant UED
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>
<script setup>
import Sidebar from './Sidebar/index.vue'
import Navbar from './Navbar/index.vue'
import { ref } from 'vue';

const collapsed = ref(false)

</script>
<style lang="scss">
.ant-layout {
    min-height: 100vh;
    background-color: #f5f5f5;

    .ant-layout-sider {

        background-color: #f5f5f5;
        min-width: 240px;
        max-width: 240px;

        // .logo {
        //     height: 32px;
        //     margin: 16px;
        // }

        // .ant-menu {
        //     background-color: #f5f5f5;
        // }
    }

    .ant-layout-header {
        background-color: #f5f5f5;
        // min-height: 72px;
        padding-inline: 0px;
        padding: 20px;
    }

    .ant-layout-content {
        padding: 20px;
    }
}

// .ant-menu-item :hover {
//     color: white;
//     background-color: #409eff;
//     // border-radius: 1rem;
// }

// .ant-menu :hover {
//     color: white;
//     background-color: #409eff;
//     border-radius: 1rem;
// }

// 不能动
// .ant-menu-light .ant-menu-item-selected {
//     color: white;
//     background-color: #409eff;
//     border-radius: 1rem;
// }



// #components-layout-demo-side .logo {
//     height: 32px;
//     margin: 16px;
//     background: rgba(240, 7, 19, 0.3);
// }

// .site-layout .site-layout-background {
//     background: #f5f5fb;
// }

// [data-theme='dark'] .site-layout .site-layout-background {
//     background: #f80909;
// }</style>