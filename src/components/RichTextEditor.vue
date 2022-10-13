<template>
    <div style="border: 1px solid #ccc">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
            :mode="mode" />
        <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
            :mode="mode" @onChange="handleChange" @onCreated="handleCreated" />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted, watch, reactive } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import requests from "../api/requests";
import { Store } from "../store";
const store = Store()
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const toolbarConfig = {
    excludeKeys: ["uploadVideo"]
}
const editorConfig = { placeholder: "'请输入内容...'" }
editorConfig.MENU_CONF = {}

editorConfig.MENU_CONF['uploadImage'] = {
    // 小于该值就插入 base64 格式（而不上传），默认为 0
    base64LimitSize: 5 * 1024, // 5kb
    server: requests.defaults.baseURL + "/upload/rich_editor_upload",
    headers: {
        token: store.token
    },
}
const mode = ref("default")
// 内容 HTML
const valueHtml = ref('')
// 自定义事件发送数据
const emit = defineEmits(["changeContent"])
const handleChange = (editor) => {
    emit("changeContent", editor.getHtml())
};

// 模拟 ajax 异步获取内容
onMounted(() => {

})
// 获取外部props数据
const props = defineProps({
    UpdatePageInfoContent:{
        type:String,
        default:""
    }
})
watch(() => props.UpdatePageInfoContent, () => {
    valueHtml.value = props.UpdatePageInfoContent
})
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

// 编辑器回调函数
const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}


</script>

<style lang='less' scoped>

</style>