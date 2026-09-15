<template>
    <a-card>
        <tool-header />
        <!-- 工具栏不能留在 .word-container 里：那是 flex 行，它一旦参与布局就会挤占 794px 的纸张宽度 -->
        <WordOperationPane v-if="word && wordContainer" :word="word" :wordContainer="wordContainer"></WordOperationPane>
        <div ref="wordContainer" class="word-container"></div>
    </a-card>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import Editor from '@hufe921/canvas-editor'
import docxPlugin from '@hufe921/canvas-editor-plugin-docx'
import floatingToolbarPlugin from '@hufe921/canvas-editor-plugin-floating-toolbar'
import { RowFlex } from '@hufe921/canvas-editor'
import WordOperationPane from '@/components/WordOperationPane.vue'
import { LOCAL_STORAGE_WORD_EDITOR_VALUE_KEY } from '@/utils/enum'

const wordContainer = ref()
const word = ref()

// 打开时优先用上次保存的内容，没有才用示例文档
const savedContent = JSON.parse(localStorage.getItem(LOCAL_STORAGE_WORD_EDITOR_VALUE_KEY)) || {
    header: [
        {
            value: 'Header',
            rowFlex: RowFlex.CENTER
        }
    ],
    main: [
        {
            value: 'Hello World'
        }
    ],
    footer: [
        {
            value: 'canvas-editor',
            size: 12
        }
    ]
}

let saveTimer = null
const writeContent = () => {
    localStorage.setItem(LOCAL_STORAGE_WORD_EDITOR_VALUE_KEY, JSON.stringify(word.value.command.getValue().data))
}

// contentChange 每次敲字都触发，直接落盘等于每输入一个字就整篇序列化 + 一次同步写，
// localStorage 的写是阻塞的，长文档会拖慢输入。攒一下再写
const saveContent = () => {
    clearTimeout(saveTimer)
    saveTimer = setTimeout(writeContent, 300)
}

// 上下留白，和下面 options 里的 maskMargin 取同一组值
const CURSOR_MASK_TOP = 60
const CURSOR_MASK_BOTTOM = 30

// 库只有方向键、定位这类路径会把光标滚进可视区（Cursor.moveCursorToVisible），
// 敲字不在其中：input() 只调 draw.render。内容长过一屏后，光标会一直往视口下方跑、
// 换页也不跟随。这里在每次内容提交后自己补上。
// 光标是库画在容器里的真实 DOM（.ce-cursor），top 已经按文档坐标算好，
// 直接量它和视口的相对位置，比照着库内部再算一遍坐标可靠。
const scrollCursorIntoView = () => {
    const cursor = wordContainer.value?.querySelector('.ce-cursor')
    if (!cursor) return
    const { top, bottom } = cursor.getBoundingClientRect()
    // 光标被隐藏时 rect 全是 0，不挡住就会被当成「光标跑到视口上方」而误滚
    if (!top && !bottom) return
    const viewportBottom = window.innerHeight - CURSOR_MASK_BOTTOM
    if (bottom > viewportBottom) {
        window.scrollBy(0, bottom - viewportBottom)
    } else if (top < CURSOR_MASK_TOP) {
        window.scrollBy(0, top - CURSOR_MASK_TOP)
    }
}

const initWord = () => {
    word.value = new Editor(wordContainer.value,
        savedContent,
        {
            "mode": "edit",
            "locale": "zhCN",
            "defaultType": "TEXT",
            "defaultColor": "#000000",
            "defaultFont": "Microsoft YaHei",
            "defaultSize": 16,
            "minSize": 5,
            "maxSize": 72,
            "defaultRowMargin": 1,
            "defaultBasicRowMarginHeight": 8,
            "defaultTabWidth": 32,
            "width": 794,
            "height": 1123,
            "scale": 1,
            "pageGap": 20,
            "underlineColor": "#000000",
            "strikeoutColor": "#FF0000",
            "rangeAlpha": 0.6,
            "rangeColor": "#AECBFA",
            "rangeMinWidth": 5,
            "searchMatchAlpha": 0.6,
            "searchMatchColor": "#FFFF00",
            "searchNavigateMatchColor": "#AAD280",
            "highlightAlpha": 0.6,
            "highlightMarginHeight": 8,
            "resizerColor": "#4182D9",
            "resizerSize": 5,
            "marginIndicatorSize": 35,
            "marginIndicatorColor": "#BABABA",
            "margins": [
                100,
                120,
                100,
                120
            ],
            "pageMode": "paging",
            "renderMode": "speed",
            "defaultHyperlinkColor": "#0000FF",
            "paperDirection": "vertical",
            "inactiveAlpha": 0.6,
            "historyMaxRecordCount": 100,
            "wordBreak": "break-word",
            "printPixelRatio": 3,
            "maskMargin": [
                60,
                0,
                30,
                0
            ],
            "letterClass": [
                "A-Za-z"
            ],
            "contextMenuDisableKeys": [],
            "shortcutDisableKeys": [],
            "scrollContainerSelector": "",
            "pageOuterSelectionDisable": false,
            "watermark": {
                "data": "CANVAS-EDITOR",
                "type": "text",
                "width": 0,
                "height": 0,
                "color": "#AEB5C0",
                "opacity": 0.3,
                "size": 120,
                "font": "Microsoft YaHei",
                "repeat": false,
                "gap": [
                    10,
                    10
                ],
                "numberType": "arabic"
            },
            "pageNumber": {
                "bottom": 60,
                "size": 12,
                "font": "Microsoft YaHei",
                "color": "#000000",
                "rowFlex": "center",
                "format": "第{pageNo}页/共{pageCount}页",
                "numberType": "arabic",
                "disabled": false,
                "startPageNo": 1,
                "fromPageNo": 0,
                "maxPageNo": null
            },
            "placeholder": {
                "data": "请输入正文",
                "color": "#DCDFE6",
                "opacity": 1,
                "size": 16,
                "font": "Microsoft YaHei"
            },
            "zone": {
                "tipDisabled": false
            },
            "table": {
                "tdPadding": [
                    0,
                    5,
                    5,
                    5
                ],
                "defaultTrMinHeight": 42,
                "defaultColMinWidth": 40,
                "defaultBorderColor": "#000000"
            },
            "header": {
                "top": 30,
                "inactiveAlpha": 1,
                "maxHeightRadio": "half",
                "disabled": false,
                "editable": true
            },
            "footer": {
                "bottom": 30,
                "inactiveAlpha": 1,
                "maxHeightRadio": "half",
                "disabled": false,
                "editable": true
            },
            "control": {
                "placeholderColor": "#9c9b9b",
                "bracketColor": "#000000",
                "prefix": "{",
                "postfix": "}",
                "borderWidth": 1,
                "borderColor": "#000000",
                "activeBackgroundColor": "",
                "disabledBackgroundColor": "",
                "existValueBackgroundColor": "",
                "noValueBackgroundColor": ""
            },
            "checkbox": {
                "width": 14,
                "height": 14,
                "gap": 5,
                "lineWidth": 1,
                "fillStyle": "#5175f4",
                "strokeStyle": "#ffffff",
                "verticalAlign": "bottom"
            },
            "radio": {
                "width": 14,
                "height": 14,
                "gap": 5,
                "lineWidth": 1,
                "fillStyle": "#5175f4",
                "strokeStyle": "#000000",
                "verticalAlign": "bottom"
            },
            "cursor": {
                "width": 1,
                "color": "#000000",
                "dragWidth": 2,
                "dragColor": "#0000FF",
                "dragFloatImageDisabled": false
            },
            "title": {
                "defaultFirstSize": 26,
                "defaultSecondSize": 24,
                "defaultThirdSize": 22,
                "defaultFourthSize": 20,
                "defaultFifthSize": 18,
                "defaultSixthSize": 16
            },
            "group": {
                "opacity": 0.1,
                "backgroundColor": "#E99D00",
                "activeOpacity": 0.5,
                "activeBackgroundColor": "#E99D00",
                "disabled": false,
                "deletable": true
            },
            "pageBreak": {
                "font": "Microsoft YaHei",
                "fontSize": 12,
                "lineDash": [
                    3,
                    1
                ]
            },
            "background": {
                "color": "#FFFFFF",
                "image": "",
                "size": "cover",
                "repeat": "no-repeat",
                "applyPageNumbers": []
            },
            "lineBreak": {
                "disabled": true,
                "color": "#CCCCCC",
                "lineWidth": 1.5
            },
            "separator": {
                "lineWidth": 1,
                "strokeStyle": "#000000"
            },
            "lineNumber": {
                "size": 12,
                "font": "Microsoft YaHei",
                "color": "#000000",
                "disabled": true,
                "right": 20,
                "type": "continuity"
            },
            "pageBorder": {
                "color": "#000000",
                "lineWidth": 1,
                "padding": [
                    0,
                    5,
                    0,
                    5
                ],
                "disabled": true
            },
            "badge": {
                "top": 0,
                "left": 5
            },
            "modeRule": {
                "print": {
                    "imagePreviewerDisabled": false
                },
                "readonly": {
                    "imagePreviewerDisabled": false
                },
                "form": {
                    "controlDeletableDisabled": false
                }
            }
        })

    word.value.use(docxPlugin)
    word.value.use(floatingToolbarPlugin)

    // contentChange 在 render 之后的 nextTick 里触发，此时光标 DOM 的位置已经更新
    word.value.listener.contentChange = () => {
        scrollCursorIntoView()
        saveContent()
    }

    word.value.register.contextMenuList([
        {
            name: "导出文档",
            when: (payload) => true,
            callback: (command) => {
                command.executeExportDocx({
                    fileName: "canvas-editor",
                });
            },
        },
        {
            name: "导入文档",
            when: (payload) => true,
            callback: (command) => {
                docxFileInput.click();
            },
        }
    ])
}

onMounted(() => {
    initWord()
})

onUnmounted(() => {
    // 路由切走时可能还有改动卡在 300ms 的窗口里，同步补一次
    if (saveTimer) {
        clearTimeout(saveTimer)
        writeContent()
    }
})
</script>

<style lang="scss" scoped>
.word-container {
    display: flex;
    align-items: center;
    justify-content: center;
    // 纸张底色，照抄官方 demo 的 body 背景；页面之间和四周留出灰底才看得出「一张张纸」
    background-color: #f2f4f7;
    // 库在最后一张纸下面留了 pageGap(20px) 外边距，顶部补上同样的留白，纸张上下才对称
    padding: 20px 0 0;

    // 每页是 .ce-page-container 里一个独立的 canvas，页面本身白底、页间透明，
    // 不加阴影时白纸和容器底色连成一片。阴影值同样照抄官方 demo 的 src/style.css
    :deep(.ce-page-container canvas) {
        box-shadow: rgb(158 161 165 / 40%) 0 2px 12px 0;
    }
}
</style>