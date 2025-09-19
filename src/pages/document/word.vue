<template>
    <a-card>
        <tool-header />
        <div ref="wordContainerRef">

        </div>
    </a-card>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Editor from '@hufe921/canvas-editor'
import docxPlugin from '@hufe921/canvas-editor-plugin-docx'
import { RowFlex } from '@hufe921/canvas-editor'

const wordContainerRef = ref()
const word = ref()

const initWord = () => {
    word.value = new Editor(wordContainerRef.value,
        {
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
        },
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
    console.log(word.value)
})
</script>