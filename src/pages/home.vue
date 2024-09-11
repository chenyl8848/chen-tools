<template>
    <div v-for="item1 in tools">
        <p class="tool-title">{{ item1.title }}</p>
        <div class="box">
            <a-card v-for="item2 in item1.children" hoverable @click="toolClick(item2)" :loading="loading">
                <template #title>
                    <a-card-meta :title="item2.title" :description="item1.title">
                        <template #avatar>
                            <!-- <icon-font :type="item2.icon" />
                            <a-badge count="5">
                                <a-avatar src="https://tools.ranblogs.com/images/logo/keywords.png" size="small"/>
                            </a-badge> -->
                            <!-- <a-avatar src="https://tools.ranblogs.com/images/logo/Time.png" size=""/> -->
                            <a-badge :dot="true" status="success">
                                <!-- <a-avatar src="https://tools.ranblogs.com/images/logo/Time.png" shape="square"
                                    size="large" /> -->
                                <a-avatar :src="item2.favicon" shape="square"
                                    size="large" />
                            </a-badge>
                        </template>
                    </a-card-meta>
                </template>
                <template #extra>
                    <a-tooltip placement="bottom" title="加入收藏">
                        <a-button type="text" shape="circle" class="btn-block" size="large" @click.stop="addFavorite">
                            <template #icon>
                                <HeartOutlined />
                            </template>
                        </a-button>
                    </a-tooltip>
                    <a-tooltip placement="bottom" title="取消收藏">
                        <a-button type="text" shape="circle" class="btn-block" size="large" v-if="false"
                            @click.stop="cancelFavorite">
                            <template #icon>
                                <icon :style="{ color: 'black' }">
                                    <template #component>
                                        <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
                                            <path
                                                d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
                                        </svg>
                                    </template>
                                </icon>
                            </template>
                        </a-button>
                    </a-tooltip>
                </template>
                <p class="box-description">{{ item2.description }}</p>
            </a-card>
        </div>
    </div>
</template>

<script setup>
import Icon from '@ant-design/icons-vue'
import { ref } from 'vue'
import { getTools } from '@/tools'
import { useRouter } from 'vue-router';
const $router = useRouter()

const loading = ref(false)
const toolClick = (tool) => {
    console.log(tool, "tooooooooooooooooo")
    $router.push(tool.path)
}

const tools = getTools().filter((item) => item.children)

const addFavorite = () => {
    console.log("addFavorite")
}

const cancelFavorite = () => {
    console.log("cancelFavorite")
}
</script>

<style lang="scss">
.tool-title {
    font-weight: 700;
    font-size: 24px;
    margin-top: 12px;
}

.box {
    display: flex;
    // 换行
    flex-wrap: wrap;

    .ant-card {
        // width: 25%;
        width: calc((100% - 64px) / 4);
        /* 每个div占一行的4分之一 */
        box-sizing: border-box;
        margin-right: 16px;
        margin-bottom: 16px;
        border-radius: 24px;

        .ant-card-head {
            min-height: 75px;
        }

        .ant-card-meta-avatar {
            width: 75px;
            padding-inline-end: 0px;
            margin: 12px 0px;
            text-align: center;
        }


        .ant-card-meta-title {
            font-weight: 700;
            font-size: 20px;
        }

        .ant-card-meta-description {
            font-weight: 700;
            font-size: 14px;
        }
    }

    .box-description {
        // font-weight: 700;
        font-size: 18px;
    }
}
</style>