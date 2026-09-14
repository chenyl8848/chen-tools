<template>
    <div class="logo">
        <router-link to="/">
            <img src="@/assets/images/chen-tools.webp" v-if="!settingStore.collapsed" />
            <img src="@/assets/images/tools.webp" v-else />
        </router-link>
        <!-- <img src="/src/assets/images/chen-tools.png" @click="goHome" /> -->
    </div>
    <a-menu mode="inline" class="sidebar-menu" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys">
        <template v-for="menu in toolStore.menus">
            <template v-if="!menu.children && !menu.isHidden">
                <a-menu-item :key="menu.path" @click="routerJump(menu)">
                    <icon-font :type="menu.icon" />
                    <a-tooltip placement="right" :title="menu.title" :open="activeTooltip === menu.path">
                        <span @mouseenter="showTitleTooltip($event, menu.path)" @mouseleave="hideTitleTooltip">{{ menu.title }}</span>
                    </a-tooltip>
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
                            <a-tooltip placement="right" :title="subMenu.title" :open="activeTooltip === subMenu.path">
                                <span @mouseenter="showTitleTooltip($event, subMenu.path)" @mouseleave="hideTitleTooltip">{{ subMenu.title }}</span>
                            </a-tooltip>
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

// 仅当标题被省略号截断时，hover 才弹出气泡显示全名；未截断的短标题不弹
const activeTooltip = ref('')
const showTitleTooltip = (e, key) => {
    const content = e.currentTarget.closest('.ant-menu-title-content') || e.currentTarget
    if (content.scrollWidth > content.clientWidth) {
        activeTooltip.value = key
    }
}
const hideTitleTooltip = () => {
    activeTooltip.value = ''
}

const $router = useRouter()
const routerJump = (menu) => {
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
    // background-color: #f5f5f5;
    background-color: $sidebarBackgroundColor;
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

// 侧边栏长标题超出部分直接裁掉，不显示省略号“...”；超长时由 hover 气泡显示全名
.sidebar-menu .ant-menu-title-content {
    text-overflow: clip !important;
}
</style>