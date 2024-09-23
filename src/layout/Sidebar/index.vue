<template>
    <div class="logo">
        <router-link to="/">
            <img src="/src/assets/images/chen-tools.svg" v-if="!settingStore.collapsed" />
            <img src="/src/assets/images/tools.svg" v-else />
        </router-link>
        <!-- <img src="/src/assets/images/chen-tools.png" @click="goHome" /> -->
    </div>
    <a-menu mode="inline" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys">
        <template v-for="menu in toolStore.menus">
            <template v-if="!menu.children && !menu.isHidden">
                <a-menu-item :key="menu.path" @click="routerJump(menu)">
                    <icon-font :type="menu.icon" />
                    <span>{{ menu.title }}</span>
                </a-menu-item>
            </template>
            <template v-if="menu.children && menu.children.length > 0 && !menu.isHidden">
                <a-sub-menu :key="menu.path">
                    <template #title>
                        <span>
                            <icon-font :type="menu.icon" />
                            <span>{{ menu.title }}</span>
                        </span>
                    </template>
                    <template v-for="subMenu in menu.children">
                        <a-menu-item :key="subMenu.path" v-if="!subMenu.isHidden" @click="routerJump(subMenu)">
                            <icon-font :type="subMenu.icon" />
                            <span>
                                {{ subMenu.title }}
                            </span>
                        </a-menu-item>
                    </template>
                </a-sub-menu>
            </template>
        </template>
    </a-menu>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import useSettingStore from '@/store/module/setting'
const settingStore = useSettingStore()
import useToolStore from '@/store/module/tool'
const toolStore = useToolStore()
import { getParentTool } from '@/utils/tools'

// import { getTools } from '@/tools'
// const menus = getTools()

const openKeys = ref([''])
const selectedKeys = ref([])

const $router = useRouter()
const routerJump = (menu) => {
    console.log(menu, "menuuuuuuuuuuu")
    $router.push(menu.path)
}

const $route = useRoute()
watch(() => $route.path, (newValue) => { 
    openKeys.value = []
    selectedKeys.value = []
    const parentTool = getParentTool(newValue)
    if (parentTool) {
        openKeys.value.push(parentTool.path)
    }
    selectedKeys.value.push(newValue)
}, { immediate: false })


</script>

<style lang="scss">
.logo {
    height: 72px;
    // margin: 16px;
    // background-color: #409eff;

    img {
        width: 100%;
        height: 72px;
    }
}

.ant-menu {
    background-color: #f5f5f5;
}

.ant-menu-light .ant-menu-item-selected {
    color: white;
    background-color: #409eff;
    border-radius: 1rem;
}

.ant-menu .ant-menu-item .anticon,
.ant-menu .ant-menu-submenu-title .anticon,
.ant-menu .ant-menu-title .anticon {
    font-size: 16px;
}

.ant-menu-title-content {
    font-size: 14px;
}
</style>