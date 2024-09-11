<template>
    <div class="navbar">
        <a-tooltip placement="bottom" title="折叠">
            <a-button type="text" shape="circle" class="btn-block" size="large" v-if="!settingStore.collapsed" @click="collapseMenu">
                <template #icon>
                    <MenuFoldOutlined />
                </template>
            </a-button>
        </a-tooltip>
        <a-tooltip placement="bottom" title="展开">
            <a-button type="text" shape="circle" class="btn-block" size="large" v-if="settingStore.collapsed" @click="collapseMenu">
                <template #icon>
                    <MenuUnfoldOutlined />
                </template>
            </a-button>
        </a-tooltip>
        <a-tooltip placement="bottom" title="主页">
            <a-button type="text" shape="circle" class="btn-block" size="large" @click="goHome">
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
            <a-button type="text" shape="circle" class="btn-block" size="large" @click="goAbout">
                <template #icon>
                    <InfoCircleOutlined />
                </template>
            </a-button>
        </a-tooltip>
        <a-tooltip placement="bottom" title="留言反馈">
            <a-button type="text" shape="circle" class="btn-block" size="large" @click="goIssue">
                <template #icon>
                    <CommentOutlined />
                </template>
            </a-button>
        </a-tooltip>
        <a-tooltip placement="bottom" title="仓库地址">
            <a-button type="text" shape="circle" class="btn-block" size="large" @click="goGithub">
                <template #icon>
                    <GithubOutlined />
                </template>
            </a-button>
        </a-tooltip>
        <a-tooltip placement="bottom" title="打赏作者">
            <a-button type="text" shape="circle" class="btn-block" size="large" @click="goReward">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import useSettingStore from '@/store/module/setting'
const $router = useRouter()

const settingStore = useSettingStore()
const collapseMenu = () => {
    settingStore.collapseMenu()
}

const goHome = () => {
    $router.push("/")
}

const goAbout = () => {
    $router.push("/about")
}

const goIssue = () => {
    $router.push("/issue")
}

const goGithub = () => {
    window.open("https://github.com/chenyl8848/chen-tools")
}

const goReward = () => {
    $router.push('/reward')
}

const handleMenuClick = (data) => {
    switch (data.key) {
        case '1':
            window.open('https://chenyl8848.github.io/')
            break
        case '2':
            window.open('https://chencoding.top:8090/#/')
            break
    }
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