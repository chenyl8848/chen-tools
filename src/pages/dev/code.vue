<template>
    <a-card>
        <tool-header></tool-header>
        <a-row class="mgb-20">
            <a-col :span="6">
                <a-form-item label="编程语言" class="mgr-20">
                    <a-select v-model:value="language" style="width: 100%" @change="handleLanguageChange">
                        <a-select-option v-for="item in languareOptions" :value="item.value">{{ item.name
                        }}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="6">
                <a-form-item label="编程语言" class="mgr-20">
                    <a-select v-model:value="theme" style="width: 100%" @change="handleThemeChange">
                        <a-select-option v-for="item in themeOptions" :value="item.value">{{ item.name
                            }}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
        <div ref="codeEditorContainerRef" class="code-editor-container">

        </div>
    </a-card>
</template>

<script setup>
import { onMounted, ref, toRaw } from 'vue'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import { LOCAL_STORAGE_CODE_EDITOR_VALUE_KEY } from '@/utils/enum'

const codeEditorContainerRef = ref()
const editor = ref()
let options = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CODE_EDITOR_VALUE_KEY)) || {}
// 编程语言
const language = ref(options?.language || 'javascript')
const languareOptions = ref([
    {
        name: 'html',
        value: 'html',
    },
    {
        name: 'javascript',
        value: 'javascript',
    },
    {
        name: 'css',
        value: 'css',
    },
    {
        name: 'json',
        value: 'json',
    },
])

// 主题颜色
const theme = ref(options?.theme || 'vs-dark')
const themeOptions = ref([
    {
        name: 'vs',
        value: 'vs',
    },
    {
        name: 'hc-black',
        value: 'hc-black',
    },
    {
        name: 'vs-dark',
        value: 'vs-dark',
    }
])

const initEditor = () => {
    self.MonacoEnvironment = {
        getWorker(_, label) {
            if (label === 'json') {
                return new jsonWorker()
            }
            if (label === 'css' || label === 'scss' || label === 'less') {
                return new cssWorker()
            }
            if (label === 'html' || label === 'handlebars' || label === 'razor') {
                return new htmlWorker()
            }
            if (label === 'typescript' || label === 'javascript') {
                return new tsWorker()
            }
            return new editorWorker()
        }
    }
    editor.value = monaco.editor.create(codeEditorContainerRef.value, {
        value: options?.value || '',
        theme: theme.value,
        //官方自带三种主题vs, hc-black, or vs-dark
        language: language.value
    })

    // const oldValue = toRaw(editorInstance.value).getValue();

    // toRaw(editorInstance.value).setValue(oldValue + newValue);

    // toRaw(editorInstance.value).dispose();
    editor.value.onDidChangeModelContent(() => {
        // console.log(editor.value.getValue(), 'getValueeeeeeeee')
        updateOptions()
    })
}

const updateOptions = () => {
    options = {
        language: language.value,
        theme: theme.value,
        value: toRaw(editor.value).getValue()
    }

    localStorage.setItem(LOCAL_STORAGE_CODE_EDITOR_VALUE_KEY, JSON.stringify(options))
}

const handleLanguageChange = () => {
    const model = toRaw(editor.value).getModel()
    monaco.editor.setModelLanguage(model, language.value)
    updateOptions()
}

const handleThemeChange = () => {
    monaco.editor.setTheme(theme.value)
    updateOptions()
}

onMounted(() => {
    initEditor()
})
</script>

<style lang="scss" scoped>
.code-editor-container {
    height: calc(100vh - 350px);
}
</style>