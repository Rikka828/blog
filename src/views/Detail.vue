<template>
    <div class="header-container">
        <div class="header">
            <span class="back" @click="router.back()">返回</span>
        </div>
    </div>
    <el-divider />
    <div class="main-contaienr">
        <div class="main">
            <h4 class="title">{{detailInfo.title}}</h4>
            <p class="create-time">{{formatDate(detailInfo.create_time)}}</p>
            <div class="html-content" v-html="detailInfo.content"></div>
        </div>

    </div>
    <el-divider />
    <div class="footer">
        <p>备案号:豫ICP备2022021658号-1</p>
    </div>
</template>

<script setup>
import { useRoute,useRouter } from "vue-router";
import { GetBlogDetailRequest } from "../api";
import { onMounted, reactive } from "vue";
import { ElMessage } from 'element-plus'
const route = useRoute()
const router = useRouter()
// 定义详情数据
const detailInfo = reactive({
    id: "",
    category_id: "",
    create_time: "",
    title: "",
    content: ""
})
// 获取详情数据
const GetBlogDetail = async (id) => {
    let { data, status } = await GetBlogDetailRequest(id)
    if (data.code === 200 && status === 200) {
        detailInfo.id = data.rows[0].id
        detailInfo.category_id = data.rows[0].category_id
        detailInfo.create_time = data.rows[0].create_time
        detailInfo.title = data.rows[0].title
        detailInfo.content = data.rows[0].content
    } else {
        return ElMessage.error('获取文章列表失败')
    }
}
// 改造时间戳   
const formatDate = (timestamp) => {
    let date = new Date(timestamp)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours() >= 10 ? date.getHours() : "0" + date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes()}`
}
onMounted(() => {
    GetBlogDetail(route.query.id)
})
</script>

<style lang='less' scoped>
.header-container {
    display: flex;
    justify-content: center;

    .header {
        width: 80%;

        .back {
            cursor: pointer;
            display: inline-block;
            font-size: 20px;
            padding: 10px;
        }
    }
}

.el-divider--horizontal {
    margin: 10px 0;
}
.main-contaienr{
    display: flex;
    justify-content: center;
    .main{
        width: 900px;
        display: flex;
        flex-direction: column;
        justify-content:center;
        .title{
            text-align: center;
            font-size: 20px;
            line-height: 50px;
            letter-spacing:2px;
        }
        .create-time{
            text-align: center;
            font-size: 14px;
            line-height: 40px;
            letter-spacing:2px;
            opacity: 0.6;
        }
        .html-content{
            font-size: 14px;
            line-height: 20px;
            letter-spacing:1px;
            text-indent:2em;/*em是相对单位，2em即现在一个字大小的两倍*/
            padding: 20px;
        }
    }
}
.footer {
    p {
        font-size: 12px;
        opacity: 0.6;
        text-align: center;
    }
}
</style>