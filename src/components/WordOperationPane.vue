<template>
    <div class="word-operation-pane">
        <a-button-group>
            <a-tooltip title="加粗(Ctrl+B)" placement="bottom">
                <a-button @click="btnBoldWord" type="text" shape="circle" :icon="h(BoldOutlined)" />
            </a-tooltip>
            <a-tooltip title="斜体(Ctrl+I)" placement="bottom">
                <a-button @click="btnItalicWord" type="text" shape="circle" :icon="h(ItalicOutlined)" />
            </a-tooltip>
            <a-tooltip title="下划线(Ctrl+U)" placement="bottom">
                <a-button @click="btnUnderlineWord" type="text" shape="circle" :icon="h(UnderlineOutlined)" />
            </a-tooltip>
            <a-tooltip title="删除线(Ctrl+Shift+X)" placement="bottom">
                <a-button @click="btnStrikeoutWord" type="text" shape="circle" :icon="h(StrikethroughOutlined)" />
            </a-tooltip>
            <a-tooltip title="字体颜色" placement="bottom">
                <a-button @click="btnStrikeoutWord" type="text" shape="circle" :icon="h(FontColorsOutlined)" />
            </a-tooltip>
            <a-tooltip title="左对齐(Ctrl+L)" placement="bottom">
                <a-button @click="btnStrikeoutWord" type="text" shape="circle" :icon="h(AlignLeftOutlined)" />
            </a-tooltip>
            <a-tooltip title="居中对齐(Ctrl+E)" placement="bottom">
                <a-button @click="btnStrikeoutWord" type="text" shape="circle" :icon="h(AlignCenterOutlined)" />
            </a-tooltip>
            <a-tooltip title="右对齐(Ctrl+R)" placement="bottom">
                <a-button @click="btnStrikeoutWord" type="text" shape="circle" :icon="h(AlignRightOutlined)" />
            </a-tooltip>
            <a-tooltip title="列表(Ctrl+Shift+U)" placement="bottom">
                <a-button @click="btnStrikeoutWord" type="text" shape="circle" :icon="h(OrderedListOutlined)" />
            </a-tooltip>
            <a-tooltip title="表格" placement="bottom">
                <a-button @click="btnStrikeoutWord" type="text" shape="circle" :icon="h(TableOutlined)" />
            </a-tooltip>
            <a-tooltip title="图片" placement="bottom">
                <a-button @click="btnStrikeoutWord" type="text" shape="circle" :icon="h(FileImageOutlined)" />
            </a-tooltip>
            <a-tooltip title="超链接" placement="bottom">
                <a-button @click="btnStrikeoutWord" type="text" shape="circle" :icon="h(LinkOutlined)" />
            </a-tooltip>
            <!-- <a-tooltip title="全屏" placement="bottom">
                <a-button @click="toggleFullScreen" type="text" shape="circle" :icon="h(FullscreenOutlined)"
                    v-show="!isFullScreen" />
            </a-tooltip> -->
            <!-- <a-tooltip title="退出全屏" placement="bottom">
                <a-button @click="toggleFullScreen" type="text" shape="circle" :icon="h(FullscreenExitOutlined)"
                    v-show="isFullScreen" />
            </a-tooltip> -->
        </a-button-group>
    </div>
</template>

<script setup>
import { h } from 'vue'
import { useFullScreen } from '@/hook/global'
import {
    FullscreenOutlined, ExportOutlined, BoldOutlined, ItalicOutlined, UnderlineOutlined,
    StrikethroughOutlined, FontColorsOutlined, AlignLeftOutlined,
    AlignCenterOutlined, AlignRightOutlined, OrderedListOutlined,
    TableOutlined, FileImageOutlined, LinkOutlined, ZoomInOutlined, ZoomOutOutlined, LineOutlined, UnorderedListOutlined, AimOutlined, FullscreenExitOutlined, SkinOutlined, SmileOutlined, QuestionCircleOutlined
} from '@ant-design/icons-vue'
const $props = defineProps({
    word: Object,
    wordContainer: Object
})
const { word, wordContainer } = $props

const [isFullScreen, fullScreen, exitFullScreen, toggleFullScreen, removeFullScreenListeners] = useFullScreen(wordContainer)

/**
 * 加粗
 */
const btnBoldWord = () => {
    word.command.executeBold()
}

/**
 * 斜体
 */
const btnItalicWord = () => {
    word.command.executeItalic()
}

/**
 * 下划线
 */
const btnUnderlineWord = () => {
    word.command.executeUnderline()
}

/**
 * 删除线
 */
const btnStrikeoutWord = () => {
    word.command.executeStrikeout()
}


</script>

<style lang="css" scoped>
.word-operation-pane {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
}
</style>