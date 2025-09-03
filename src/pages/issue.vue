<template>
    <a-card>
        <tool-header />
        <p>如果您发现了 Bug，或者某些功能未能按预期工作，或者想集成某些功能，请在 GitHub 仓库的 <a href="https://github.com/chenyl8848/chen-tools/issues"
                target="_blank">issues</a> 中提交报告。</p>
        <a-list item-layout="horizontal" :data-source="issues">
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-skeleton avatar :title="false" :loading="loading" active>
                        <a-list-item-meta :description="item.title">
                            <template #title>
                                <a :href="item.user.html_url" target="_blank">{{ item.user.login }}</a>
                            </template>
                            <template #avatar>
                                <a-avatar :src="item.user.avatar_url" />
                            </template>
                        </a-list-item-meta>
                        <div><a :key="item.id" :href="item.html_url" target="_blank">查看</a></div>
                    </a-skeleton>
                </a-list-item>
            </template>
        </a-list>
    </a-card>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const loading = ref(false)
const issuesApi = 'https://api.github.com/repos/chenyl8848/chen-tools/issues'
const issues = ref([])
const getIssues = async () => {
    loading.value = true
    issues.value = (await axios.get(issuesApi)).data
    loading.value = false
}

onMounted(() => {
    getIssues()
})
</script>