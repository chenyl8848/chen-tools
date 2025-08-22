<template>
    <a-card>
        <tool-title :title="'JSON 格式化'" :description="'JSON 格式化工具'"></tool-title>
        <a-row>
            <a-col :span="10" class="mgr-20">
                <a-textarea v-model:value="jsonData.raw" :auto-size="{ minRows: 20, maxRows: 20 }" allowClear/>
            </a-col>
            <a-col :span="2" class="mgl-20" style="margin-top: 5%;">
                <a-space direction="vertical" size="large">
                    <a-button type="primary" @click="format">格式化</a-button>
                    <a-button type="primary" @click="compress">压缩</a-button>
                    <a-button type="primary" @click="escape">转义</a-button>
                    <a-button type="primary" @click="removeEscape">去转义</a-button>
                    <a-button type="primary" @click="copy">复制</a-button>
                </a-space>
            </a-col>
            <a-col :span="10">
                <div style="border: 1px solid #d9d9d9; border-radius: 6px; height: 450px; overflow: auto;">
                    <!-- <vue-json-pretty :data="formatJSON" showIcon showLineNumber virtual :deep="4" :height="500" /> -->
                    <vue-json-pretty :data="jsonData.format" showIcon showLineNumber virtual :deep="4" :indent="2"
                        v-show="jsonData.format" />
                    <p v-show="jsonData.result" v-html="jsonData.result">
                    </p>
                    <!-- {{ jsonData.result }} -->
                </div>
                <!-- <JsonViewer :value="formatJSON" copyable :expandDepth="5"  boxed sort theme="light" /> -->
            </a-col>
        </a-row>
    </a-card>
</template>

<script setup>
import { message } from 'ant-design-vue'
import { reactive } from 'vue'
import { copyText, transferred } from '@/utils/common'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

const jsonData = reactive({
    raw: '',
    format: '',
    result: ''
})

// { "templateFormValues": [{ "formName": "noBeginDay", "formValue": "/" }, { "formName": "noBeginMonth", "formValue": "/" }, { "formName": "noBeginYear", "formValue": "/" }, { "formName": "entryTimeB", "formValue": "2025年05月07日" }, { "formName": "entryTimeA", "formValue": "2025年05月07日" }, { "formName": "otherItems", "formValue": "乙方同意甲方安排其至与甲方有关的项目公司工作。" }, { "formName": "probationEndDay", "formValue": "6" }, { "formName": "emergencyContract", "formValue": "施父15559698989" }, { "formName": "contractPhone", "formValue": "18359104113" }, { "formName": "damageMoney", "formValue": "/" }, { "formName": "appendix", "formValue": "《建发房地产集团有限公司人力资源管理制度》、《建发房地产集团人力资源管理指导手册》等人力资源管理规定，乙方任职所在单位的规章制度" }, { "formName": "payTime", "formValue": "10" }, { "formName": "salaryBase", "formValue": "24444" }, { "formName": "salary", "formValue": "24444" }, { "formName": "salaryType", "formValue": "1" }, { "formName": "workHourType", "formValue": "3" }, { "formName": "workContent", "formValue": "房地产开发、商业运营及相关工作" }, { "formName": "probationEndMonth", "formValue": "11" }, { "formName": "probationEndYear", "formValue": "2025" }, { "formName": "probationBeginDay", "formValue": "7" }, { "formName": "probationBeginMonth", "formValue": "5" }, { "formName": "probationBeginYear", "formValue": "2025" }, { "formName": "probationTime", "formValue": "6" }, { "formName": "endDay", "formValue": "10" }, { "formName": "endMonth", "formValue": "7" }, { "formName": "endYear", "formValue": "2028" }, { "formName": "beginDay", "formValue": "7" }, { "formName": "beginMonth", "formValue": "5" }, { "formName": "beginYear", "formValue": "2025" }, { "formName": "contractType", "formValue": "1" }, { "formName": "postcode", "formValue": "350000" }, { "formName": "contractAddress", "formValue": "福建省厦门市思明区金凤花园A栋111号" }, { "formName": "licenseNo", "formValue": "350203199309032029" }, { "formName": "licenseName", "formValue": "身份证" }, { "formName": "userName", "formValue": "施丹青" }, { "formName": "legalUser", "formValue": "叶耿" }, { "formName": "address", "formValue": "上海市宝山区顾北东路575弄1-17号A区111-18" }, { "formName": "companyName", "formValue": "上海众承房地产开发有限公司" }], "templateSeries": "SHR-001" }

// 格式化
const format = () => {
    // formatJSON = reactive({...JSON.parse(json.value)})
    jsonData.result = ''
    try {
        jsonData.format = JSON.parse(jsonData.raw)
        // jsonData.format = JSON.stringify(JSON.parse(jsonData.raw), null, '\t')
    } catch (error) {
        console.log(error)
        message.error('这不是一个好的 JSON')
    }
}

// 压缩
const compress = () => {
    jsonData.format = ''
    jsonData.result = jsonData.raw.replace(/[\r\n\t]/g, "").replace(/\s+/g, "")
}

// 转义
const escape = () => {
    jsonData.format = ''
    jsonData.result = transferred(jsonData.raw, "\"")
}

// 去转义
const removeEscape = () => {
    jsonData.result = jsonData.raw.replace(/[\\]/g, ``)
}

// 复制
const copy = () => {
    if (jsonData.format) {
        copyText(JSON.stringify(jsonData.format, null, 2))
    } else if (jsonData.result) {
        copyText(jsonData.result)
    }
}
</script>

<style lang="css" scoped>
:deep(.vjs-value-string) {
    color: #a11;
}
</style>