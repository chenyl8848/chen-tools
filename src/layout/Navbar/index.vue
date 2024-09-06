<template>
    <div class="navbar">
        <a-tooltip placement="bottom" title="折叠">
            <a-button type="text" shape="circle" class="btn-block" size="large" v-if="!collapsed" @click="collapseMenu">
                <template #icon>
                    <MenuFoldOutlined />
                </template>
            </a-button>
        </a-tooltip>
        <a-tooltip placement="bottom" title="展开">
            <a-button type="text" shape="circle" class="btn-block" size="large" v-if="collapsed" @click="collapseMenu">
                <template #icon>
                    <MenuUnfoldOutlined />
                </template>
            </a-button>
        </a-tooltip>
        <a-tooltip placement="bottom" title="主页">
            <a-button type="text" shape="circle" class="btn-block" size="large">
                <template #icon>
                    <HomeOutlined />
                </template>
            </a-button>
        </a-tooltip>
        <a-input v-model:value="keyword" placeholder="输入关键词搜索" @keydown.enter="onSearch">
            <template #suffix>
                <a-button type="text" shape="circle" class="btn-block" @click="onSearch">
                    <template #icon>
                        <search-outlined />
                    </template>
                </a-button>
            </template>
        </a-input>
        <a-tooltip placement="bottom" title="关于本站">
            <a-button type="text" shape="circle" class="btn-block" size="large">
                <template #icon>
                    <InfoCircleOutlined />
                </template>
            </a-button>
        </a-tooltip>
        <a-tooltip placement="bottom" title="留言反馈">
            <a-button type="text" shape="circle" class="btn-block" size="large">
                <template #icon>
                    <CommentOutlined />
                </template>
            </a-button>
        </a-tooltip>
        <a-tooltip placement="bottom" title="仓库地址">
            <a-button type="text" shape="circle" class="btn-block" size="large">
                <template #icon>
                    <GithubOutlined />
                </template>
            </a-button>
        </a-tooltip>
        <a-tooltip placement="bottom" title="打赏作者">
            <a-button type="text" shape="circle" class="btn-block" size="large">
                <template #icon>
                    <CoffeeOutlined />
                </template>
            </a-button>
        </a-tooltip>
        <a-dropdown>
            <template #overlay>
                <a-menu @click="handleMenuClick">
                    <a-menu-item key="1">
                        <FileTextOutlined />
                        个人博客网站
                    </a-menu-item>
                    <a-menu-item key="2">
                        <StarOutlined />
                        开源项目合集
                    </a-menu-item>
                </a-menu>
            </template>
            <a-button shape="round" type="primary" style="margin-right: 12px;">
                其他网站
                <DownOutlined />
            </a-button>
        </a-dropdown>
    </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const $emits = defineEmits('collapseMenu')
const collapsed = ref(false)
const collapseMenu = () => {
    collapsed.value = !collapsed.value
    $emits('collapseMenu')
}

const keyword = ref('')
const onSearch = () => {
    console.log(keyword, "keyworddddddddddd")
}
</script>

<style lang="scss" scoped>
.navbar {
    display: flex;
    width: 100%;
    align-items: center;

    .btn-block {
        // font-size: 24px;
        margin-right: 2px;
    }
}
</style>