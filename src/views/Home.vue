<template>
    <!-- 菜单部分 -->
    <el-menu default-active="1" class="el-menu-demo" mode="horizontal">
        <div class="menu-container">
            <el-menu-item index="1" @click="toPage('/home')">首页</el-menu-item>
            <el-menu-item index="2" @click="toPage('/dashboard/category')">分类</el-menu-item>
            <el-menu-item index="4" @click="toPage('/dashboard/article')">后台</el-menu-item>
            <div class="flex-grow" />

            <el-menu-item index="4" @click="toPage('/login')">登陆</el-menu-item>
        </div>
    </el-menu>
    <!-- 中心部分 -->
    <div class="main-container">
        <div class="main">
            <div class="search">
                <el-input v-model="keyword" placeholder="Please input" clearable />
                <el-select v-model="categoryid" class="m-2" placeholder="Select" size="large">
                    <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-button type="primary" size="large" @click="GetBlogList">搜索</el-button>
            </div>
            <el-card class="box-card" shadow="hover" style="margin-bottom:20px" v-for=" item in blogList" :key="item.id"
                @click="toDetail(item.id)">
                <template #header>
                    <h3>{{item.title}}</h3>
                </template>
                <div style="margin-bottom: 10px;">{{adddiandiandian(item.content)}}</div>
                <div style="font-size: 12px;opacity: 0.6;">{{formatDate(item.create_time)}}</div>
            </el-card>
            <el-pagination background layout="prev, pager, next" v-model:page-size="pageInfo.pageSize"
                v-model:current-page="pageInfo.page" :total="pageInfo.total" />
        </div>
    </div>


    <!-- 底部 -->
    <el-divider />
    <div class="footer">
        <p>Power by xxx</p>
        <p>XICP 备xxxxx号-1</p>
    </div>
</template>
  
<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from "vue-router";
import { GetCategoryListRequest, GetBlogListRequest } from "../api";
import { ElMessage } from 'element-plus'
const router = useRouter()
const toPage = (url) => {
    router.push(url)
}
const toDetail = (id) => {
    router.push({ path: "/detail", query: { id: id } })
}
// 查询组件
const keyword = ref('')
const categoryid = ref('')
const categoryOptions = reactive([])
// 获取分类列表
const GetCategoryList = async () => {
    let { data, status } = await GetCategoryListRequest()
    if (data.code === 200 && status === 200) {
        data.data.forEach(item => {
            categoryOptions.push(item)
        });
    } else {
        ElMessage.error('获取列表失败')
    }
}
// 博客数据
const blogList = reactive([])
// 获取博客列表
const GetBlogList = async () => {
    let query = {
        keyword: keyword.value,
        categoryid: categoryid.value,
        page: pageInfo.page,
        pageSize: pageInfo.pageSize
    }
    let { data, status } = await GetBlogListRequest(query)
    if (data.code === 200 && status === 200) {
        blogList.splice(0)
        pageInfo.total = data.data.count
        blogList.push(...data.data.rows)
    } else {
        return ElMessage.error('获取文章列表失败')
    }
}
// 给博客列表content添加...
const adddiandiandian = (content) => {
    let newHtml = content.replace( /<[^>]+>/gi,"")
    return newHtml + "..."
}
// 改造时间戳   
const formatDate = (timestamp) => {
    let date = new Date(timestamp)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours() >= 10 ? date.getHours() : "0" + date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes()}`
}
// 分页器数据
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    total: 10
})
// 根据关键字和分类id获取blog

onMounted(() => {
    GetCategoryList()
    GetBlogList()
    watch(() => pageInfo.page, () => {
        GetBlogList()
    })
})
</script>

<style lang='less' scoped>
// 菜单样式
.el-menu-demo {
    display: flex;
    justify-content: center;

    .menu-container {
        width: 900px;
        display: flex;

        .flex-grow {
            flex-grow: 1;
        }
    }
}

.main-container {
    display: flex;
    justify-content: center;

    .main {
        width: 800px;
        display: flex;
        justify-content: center;
        flex-direction: column;

        .search {
            margin: 20px 0;
            display: flex;
            justify-content: space-between;

            .m-2 {
                margin: 0 20px;
            }
        }

        .box-card {
            cursor: pointer;
        }
    }
}


// 底部
.footer {
    p {
        font-size: 12px;
        opacity: 0.6;
        text-align: center;
    }
}
</style>