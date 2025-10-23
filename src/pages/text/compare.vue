<template>
    <a-card>
        <tool-header></tool-header>
        <div ref="diffEditorContainerRef" class="diff-editor-container"></div>
    </a-card>
</template>

<script setup>
import { ref, toRaw, onMounted } from 'vue'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

const diffEditor = ref()
const diffEditorContainerRef = ref()
const initDiffEditor = () => {
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
    const originalModel = monaco.editor.createModel(
	/* set from `originalModel`: */ `Java 陈序员`,
        "text/plain"
    )
    const modifiedModel = monaco.editor.createModel(
	/* set from `modifiedModel`: */ `Java 程序员`,
        "text/plain"
    )
    diffEditor.value = monaco.editor.createDiffEditor(diffEditorContainerRef.value, {
        originalEditable: true,
        automaticLayout: true,
    })

    toRaw(diffEditor.value).setModel({
        original: originalModel,
        modified: modifiedModel,
    })
}

onMounted(() => {
    initDiffEditor()
})

</script>

<style lang="scss" scoped>
.diff-editor-container {
    height: calc(100vh - 350px);
}
</style>