<template>
    <a-card>
        <p class="title">在线表格</p>
        <div class="excelContainer" ref="excelContainerRef"></div>
    </a-card>
</template>

<script setup>
import "@univerjs/design/lib/index.css"
import "@univerjs/ui/lib/index.css"
import "@univerjs/docs-ui/lib/index.css"
import "@univerjs/sheets-ui/lib/index.css"
import "@univerjs/sheets-formula/lib/index.css"
import { Univer, UniverInstanceType, LocaleType, Tools } from '@univerjs/core'
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula'
import { UniverRenderEnginePlugin } from '@univerjs/engine-render'
import { defaultTheme } from "@univerjs/design"
import { UniverUIPlugin } from '@univerjs/ui'
import { onMounted, ref } from 'vue'
import { UniverDocsPlugin } from "@univerjs/docs"
import { UniverDocsUIPlugin } from "@univerjs/docs-ui"
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui"
import { UniverSheetsPlugin } from "@univerjs/sheets"
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula"
import DesignZhCN from '@univerjs/design/locale/zh-CN'
import UIZhCN from '@univerjs/ui/locale/zh-CN'
import DocsUIZhCN from '@univerjs/docs-ui/locale/zh-CN'
import SheetsZhCN from '@univerjs/sheets/locale/zh-CN'
import SheetsUIZhCN from '@univerjs/sheets-ui/locale/zh-CN'
import SheetsFormulaZhCN from '@univerjs/sheets-formula/locale/zh-CN'

const excelContainerRef = ref()
let excel = ref(null)
let workbook = ref(null)

const initExcel = () => {
    const univer = new Univer({
        theme: defaultTheme,
        locale: LocaleType.ZH_CN,
        locales: {
            [LocaleType.ZH_CN]: Tools.deepMerge(
                SheetsZhCN,
                DocsUIZhCN,
                SheetsUIZhCN,
                SheetsFormulaZhCN,
                UIZhCN,
                DesignZhCN,
            )
        },
    })

    excel.value = univer

    univer.registerPlugin(UniverRenderEnginePlugin)
    univer.registerPlugin(UniverFormulaEnginePlugin)
    univer.registerPlugin(UniverUIPlugin, {
        container: excelContainerRef.value
    })

    univer.registerPlugin(UniverDocsPlugin)
    univer.registerPlugin(UniverDocsUIPlugin)

    univer.registerPlugin(UniverSheetsPlugin)
    univer.registerPlugin(UniverSheetsUIPlugin)
    univer.registerPlugin(UniverSheetsFormulaPlugin)

    // create workbook instance
    workbook.value = excel.value.createUnit(UniverInstanceType.UNIVER_SHEET, {})
}

onMounted(() => {
    initExcel()
})
</script>

<style lang="scss">
.title {
    font-size: 16px;
    font-weight: 600;
}

.excelContainer {
    margin: 0;
    padding: 0;
    width: 100%;
    height: calc(100vh - 260px)
}
</style>