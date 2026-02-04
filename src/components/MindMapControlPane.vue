<template>
    <div class="operation-btn">
        <a-button-group>
            <a-upload v-model:file-list="fileList" :show-upload-list="false" :before-upload="beforeUpload">
                <a-tooltip title="导入" placement="bottom">
                    <a-button @click="btnImportMindMap" type="text" shape="circle" :icon="h(ImportOutlined)" />
                </a-tooltip>
            </a-upload>
            <a-tooltip title="导出" placement="bottom">
                <a-button @click="btnExportMindMap" type="text" shape="circle" :icon="h(ExportOutlined)" />
            </a-tooltip>
            <a-tooltip title="图标" placement="bottom">
                <a-button @click="btnIconMindMap" type="text" shape="circle" :icon="h(SmileOutlined)"
                    :disabled="activeNodes.length === 0" />
            </a-tooltip>
            <a-popover v-model:open="linkPopover" title="超链接" trigger="click">
                <template #content>
                    <a-form :model="linkForm" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
                        autocomplete="off">
                        <a-form-item label="名称" name="linkName">
                            <a-input v-model:value="linkForm.linkName" allow-clear />
                        </a-form-item>
                        <a-form-item label="地址" name="linkAddress">
                            <a-input v-model:value="linkForm.linkAddress" allow-clear>
                                <template #addonBefore>
                                    <a-select v-model:value="linkForm.linkAddressBefore" style="width: 90px">
                                        <a-select-option value="http://">http://</a-select-option>
                                        <a-select-option value="https://">https://</a-select-option>
                                    </a-select>
                                </template>
                            </a-input>
                        </a-form-item>
                        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                            <a-button @click="removeLink()" class="mgr-20">移除</a-button>
                            <a-button type="primary" html-type="submit" @click="setLink()">添加</a-button>
                        </a-form-item>
                    </a-form>
                </template>
                <a-tooltip title="超链接" placement="bottom">
                    <a-button @click="btnLinkMindMap" type="text" shape="circle" :icon="h(LinkOutlined)"
                        :disabled="activeNodes.length === 0" />
                </a-tooltip>
            </a-popover>
            <a-tooltip title="概要" placement="bottom">
                <a-button @click="btnGeneralizationMindMap" type="text" shape="circle" :icon="h(UnorderedListOutlined)"
                    :disabled="activeNodes.length === 0" />
            </a-tooltip>
            <a-tooltip title="关联线" placement="bottom">
                <a-button @click="btnLineMindMap" type="text" shape="circle" :icon="h(LineOutlined)"
                    :disabled="activeNodes.length === 0" />
            </a-tooltip>
            <a-tooltip title="全屏" placement="bottom">
                <a-button @click="toggleFullScreen" type="text" shape="circle" :icon="h(FullscreenOutlined)"
                    v-show="!isFullScreen" />
            </a-tooltip>
            <a-tooltip title="放大" placement="bottom">
                <a-button @click="btnEnlargeMindMap" type="text" shape="circle" :icon="h(ZoomInOutlined)" />
            </a-tooltip>
            <a-tooltip title="缩小" placement="bottom">
                <a-button @click="btnNarrowMindMap" type="text" shape="circle" :icon="h(ZoomOutOutlined)" />
            </a-tooltip>
            <a-tooltip title="恢复到默认的变换" placement="bottom">
                <a-button @click="btnResetMindMap" type="text" shape="circle" :icon="h(AimOutlined)" />
            </a-tooltip>
            <a-tooltip title="退出全屏" placement="bottom">
                <a-button @click="toggleFullScreen" type="text" shape="circle" :icon="h(FullscreenExitOutlined)"
                    v-show="isFullScreen" />
            </a-tooltip>
            <a-tooltip title="快捷键" placement="bottom">
                <a-button @click="btnShortCutKeyMindMap" type="text" shape="circle" :icon="h(QuestionCircleOutlined)" />
            </a-tooltip>
            <a-tooltip title="主题" placement="bottom">
                <a-button @click="btnSetTheme" type="text" shape="circle" :icon="h(SkinOutlined)" />
            </a-tooltip>
        </a-button-group>
    </div>
    <a-modal v-model:open="exportModal" @ok="onOkExportModal" @cancel="onCancelExportModal" :closable="false"
        okText="确定" cancelText="取消">
        <a-form :model="exportForm" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
            autocomplete="off">
            <a-form-item label="格式" name="fileFormat">
                <a-radio-group v-model:value="exportForm.fileFormat">
                    <a-radio :style="radioStyle" value="smm">
                        <a-tooltip placement="right">
                            <template #title>私有格式，可用于再次导入，客户端可直接编辑</template>
                            <a-tag color="blue">.smm</a-tag>
                        </a-tooltip>
                    </a-radio>
                    <a-radio :style="radioStyle" value="json">
                        <a-tooltip placement="right">
                            <template #title>流行的数据交换格式，可用于再次导入</template>
                            <a-tag color="blue">.json</a-tag>
                        </a-tooltip>
                    </a-radio>
                    <a-radio :style="radioStyle" value="png">
                        <a-tooltip placement="right">
                            <template #title>常用图片格式，适合查看分享</template>
                            <a-tag color="blue">.png</a-tag>
                        </a-tooltip>
                    </a-radio>
                    <a-radio :style="radioStyle" value="svg">
                        <a-tooltip placement="right">
                            <template #title>可缩放矢量图形</template>
                            <a-tag color="blue">.svg</a-tag>
                        </a-tooltip>
                    </a-radio>
                    <a-radio :style="radioStyle" value="pdf">
                        <a-tooltip placement="right">
                            <template #title>适合查看浏览和打印</template>
                            <a-tag color="blue">.pdf</a-tag>
                        </a-tooltip>
                    </a-radio>
                    <a-radio :style="radioStyle" value="md">
                        <a-tooltip placement="right">
                            <template #title>md 文本格式，便于其他软件打开</template>
                            <a-tag color="blue">.md</a-tag>
                        </a-tooltip>
                    </a-radio>
                    <a-radio :style="radioStyle" value="xmind">
                        <a-tooltip placement="right">
                            <template #title>XMind 软件格式</template>
                            <a-tag color="blue">.xmind</a-tag>
                        </a-tooltip>
                    </a-radio>
                    <a-radio :style="radioStyle" value="txt">
                        <a-tooltip placement="right">
                            <template #title>纯文本文件</template>
                            <a-tag color="blue">.txt</a-tag>
                        </a-tooltip>
                    </a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="文件名称" name="fileName">
                <a-input v-model:value="exportForm.fileName" allow-clear />
            </a-form-item>
        </a-form>
    </a-modal>
    <a-drawer placement="right" :closable="false" :open="iconDrawer" @close="onCloseIconDrawer">
        <div v-for="dataItem in nodeIconList" :key="dataItem.type">
            <h3>{{ dataItem.name }}</h3>
            <a-list size="small" :data-source="dataItem.list" :split="false" itemLayout="vertical"
                :grid="{ gutter: 8, column: 8 }">
                <template #renderItem="{ item }">
                    <a-list-item>
                        <svg v-html="item.icon" style="width: 32px;height: 32px; cursor: pointer;"
                            @click="setIcon(dataItem, item)"></svg>
                    </a-list-item>
                </template>
            </a-list>
        </div>
    </a-drawer>
    <a-drawer placement="right" :closable="false" :open="shortCutKeyDrawer" @close="onCloseShortCutKeyDrawer">
        <div v-for="dataItem in MIND_MAP_SHORTCUTS" :key="dataItem.type">
            <h3>{{ dataItem.type }}</h3>
            <a-list size="small" :data-source="dataItem.list" :split="false">
                <template #renderItem="{ item }">
                    <a-list-item>
                        - {{ item.name }}：{{ item.value }}
                    </a-list-item>
                </template>
            </a-list>
        </div>
    </a-drawer>
    <a-drawer placement="right" :closable="false" :open="themeDrawer" @close="onCloseThemDrawer">
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="明亮主题">
                <a-list size="large" :data-source="themeList.lightList">
                    <template #renderItem="{ item }">
                        <a-list-item>
                            <img :src="themeImgMap[item.value]" style="width: 100%; height: 100%; cursor: pointer;"
                                @click="setTheme(item)" />
                        </a-list-item>
                    </template>
                </a-list>
            </a-tab-pane>
            <a-tab-pane key="2" tab="暗黑主题">
                <a-list size="large" :data-source="themeList.darkList">
                    <template #renderItem="{ item }">
                        <a-list-item>
                            <img :src="themeImgMap[item.value]" style="width: 100%; height: 100%; cursor: pointer;"
                                @click="setTheme(item)" />
                        </a-list-item>
                    </template>
                </a-list>
            </a-tab-pane>
        </a-tabs>
    </a-drawer>
</template>

<script setup>
import { h, defineProps, ref, onMounted, shallowRef } from 'vue'
const $props = defineProps({
    mindMap: Object,
    mindMapContainer: Object,
})
const { mindMap, mindMapContainer } = $props
import { FullscreenOutlined, ExportOutlined, ImportOutlined, ZoomInOutlined, ZoomOutOutlined, LineOutlined, UnorderedListOutlined, LinkOutlined, AimOutlined, FullscreenExitOutlined, SkinOutlined, SmileOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { useFullScreen } from '@/hook/global'
import { MIND_MAP_SHORTCUTS } from '@/utils/enum'
import themeList from 'simple-mind-map-plugin-themes'
import themeImgMap from 'simple-mind-map-plugin-themes/themeImgMap'
import { nodeIconList } from 'simple-mind-map/src/svg/icons'
import { reactive } from 'vue'
import { LOCAL_STORAGE_CODE_MIND_MAP_VALUE_KEY } from '@/utils/enum'
import xmind from 'simple-mind-map/src/parse/xmind.js'
import markdown from 'simple-mind-map/src/parse/markdown.js'

const [isFullScreen, fullScreen, exitFullScreen, toggleFullScreen, removeFullScreenListeners] = useFullScreen($props.mindMapContainer)

const activeNodes = shallowRef([])
const initMindMap = () => {
    mindMap.on('node_active', (node, activeNodeList) => {
        activeNodes.value = activeNodeList
    })

    mindMap.on('data_change', data => {
        // 节点树数据改变
        // data即完整数据中的root部分
        btnSaveMindMap()
    })

    mindMap.on('view_data_change', data => {
        // 节点树数据改变
        // data即完整数据中的root部分
        btnSaveMindMap()
    })
}

onMounted(() => {
    initMindMap()
})

/**
 * 保存数据
 */
const btnSaveMindMap = () => {
    if (!mindMap) {
        console.error('mindMap is not available')
        return
    }
    // 实现保存逻辑
    const fullData = mindMap.getData(true)
    localStorage.setItem(LOCAL_STORAGE_CODE_MIND_MAP_VALUE_KEY, JSON.stringify(fullData))
}

// 导入
const fileList = ref([])
let data = {}
// 处理 .xmind 文件
const handleXmind = async (file) => {
    try {
        let data = await xmind.parseXmindFile(file)
        setData(data)
    } catch (error) {
        console.log(error)
        message.error('文件导入失败！')
    }
}

// 处理 Markdown 文件
const handleMd = async (file) => {
    let fileReader = new FileReader()
    fileReader.readAsText(file)
    fileReader.onload = async evt => {
        try {
            let data = await markdown.transformMarkdownTo(evt.target.result)
            setData(data)
        } catch (error) {
            console.log(error)
            message.error('文件导入失败！')
        }
    }
}

// 导入数据
const setData = (data) => {
    if (data.root) {
        mindMap.setFullData(data)
    } else {
        mindMap.setData(data)
    }
    mindMap.view.reset()
}
const beforeUpload = (file) => {
    let reg = /\.(smm|xmind|json|xlsx|md)$/
    if (!reg.test(file.name)) {
        message.error('请选择 .smm、.json、.xmind、.md文件！')
        return
    }

    if (/\.(smm|json)$/.test(file.name)) {
        const reader = new FileReader()
        reader.onload = (e) => {
            // 文件内容，例如文本文件的内容会是字符串形式
            const content = e.target.result
            try {
                // 在这里处理文件内容，例如解析JSON等
                data = JSON.parse(content)
                setData(data)
            } catch (error) {
                console.log(error)
                message.error('请上传正确的 JSON 文件！')
            }
        }
        // 以文本形式读取文件内容，如果是其他类型文件，可以选择其他方法如readAsDataURL等
        reader.readAsText(file)
    } else if (/\.xmind$/.test(file.name)) {
        handleXmind(file)
    } else if (/\.md$/.test(file.name)) {
        handleMd(file)
    }
    // 阻止自动上传，因为我们手动处理了文件内容
    return false
}
const btnImportMindMap = () => {
    if (!mindMap) {
        console.error('mindMap is not available')
        return
    }
    // 实现导入逻辑
    console.log('Import mindmap')
}

/**
 * 导出
 */
const exportModal = ref(false)
const exportForm = reactive({
    fileFormat: 'smm',
    fileName: '思维导图',
})
const radioStyle = reactive({
    display: 'flex',
    height: '30px',
    lineHeight: '30px',
})
const btnExportMindMap = async (key) => {
    if (!mindMap) {
        console.error('mindMap is not available')
        return
    }

    exportModal.value = true
}
const onOkExportModal = async () => {
    // console.log(key, "keyyyyyyyyyyyy")
    // let data = await mindMap.doExport.png() // 修正：使用 mindMap
    // console.log(data, "dddddddddddddd")
    // let a = document.createElement('a')
    // a.href = data
    // a.download = 'mindmap'
    // a.click()
    console.log('Export mindmap', exportForm.fileFormat, exportForm.fileName)
    mindMap.export(exportForm.fileFormat, true, exportForm.fileName, true)
    exportModal.value = false
}

const onCancelExportModal = () => {
    exportModal.value = false
}

/**
 * 图标
 */
const iconDrawer = ref(false)
const onCloseIconDrawer = () => {
    iconDrawer.value = false
}
const btnIconMindMap = () => {
    if (!mindMap) {
        console.error('mindMap is not available')
        return
    }
    iconDrawer.value = true
    console.log('Icon', nodeIconList, activeNodes.value)
}
const setIcon = (dataItem, item) => {
    activeNodes.value.forEach(node => {
        const icon = dataItem.type + "_" + item.name
        const currentNodeIcons = node.getData('icon') || []
        if (currentNodeIcons.includes(icon)) {
            currentNodeIcons.splice(currentNodeIcons.indexOf(icon), 1)
        } else {
            currentNodeIcons.push(icon)
        }
        node.setIcon(currentNodeIcons)
    })

    onCloseIconDrawer()
}

/**
 * 超链接
 */
const btnLinkMindMap = () => {
    if (!mindMap) {
        console.error('mindMap is not available')
        return
    }

    // const url = activeNode.getData('hyperlink')
    // const name = activeNode.getData('hyperlinkTitle')
}
const linkPopover = ref(false)
const linkForm = reactive({
    linkName: '',
    linkAddress: '',
    linkAddressBefore: 'https://',
})
const setLink = () => {
    activeNodes.value.forEach(node => {
        node.setHyperlink(linkForm.linkAddressBefore + linkForm.linkAddress, linkForm.linkName)
    })
    console.log('linkForm', linkForm)
    linkPopover.value = false
}
const removeLink = () => {
    activeNodes.value.forEach(node => {
        node.setHyperlink(null, null)
    })
    console.log('linkForm', linkForm)
    linkPopover.value = false
}

/**
 * 概要
 */
const btnGeneralizationMindMap = () => {
    if (!mindMap) {
        console.error('mindMap is not available')
        return
    }

    mindMap.execCommand('ADD_GENERALIZATION')
}

/**
 * 关联
 */
const btnLineMindMap = () => {
    if (!mindMap) {
        console.error('mindMap is not available')
        return
    }

    mindMap.associativeLine.createLineFromActiveNode()
}

/**
 * 放大
 */
const btnEnlargeMindMap = () => {
    if (!mindMap) {
        console.error('mindMap is not available')
        return
    }
    const view = mindMap.view
    view.enlarge(0.5, 0.5)
}

/**
 * 缩小
 */
const btnNarrowMindMap = () => {
    if (!mindMap) {
        console.error('mindMap is not available')
        return
    }
    const view = mindMap.view
    view.narrow(0.5, 0.5)
}

/**
 * 恢复到默认的变换
 */
const btnResetMindMap = () => {
    if (!mindMap) {
        console.error('mindMap is not available')
        return
    }
    const view = mindMap.view
    view.reset()
}

/** 
 *  快捷键
 */
const shortCutKeyDrawer = ref(false)
const onCloseShortCutKeyDrawer = () => {
    shortCutKeyDrawer.value = false
}
const btnShortCutKeyMindMap = () => {
    if (!mindMap) {
        console.error('mindMap is not available')
        return
    }
    shortCutKeyDrawer.value = true
}

/**
 * 设置主题
 */
const themeDrawer = ref(false)
const activeKey = ref('1')
const onCloseThemDrawer = () => {
    themeDrawer.value = false
}
const btnSetTheme = () => {
    if (!mindMap) {
        console.error('mindMap is not available')
        return
    }
    themeDrawer.value = true
}
const setTheme = (theme) => {
    mindMap.setTheme(theme.value)
}

</script>

<style lang="scss" scoped>
.operation-btn {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    background-color: #fff;
    padding: 8px;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>