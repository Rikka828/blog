<template>
    <el-tabs v-model="activeTab" class="demo-tabs">
        <!-- 1.文章列表 -->
        <el-tab-pane label="文章列表" name="list">
            <el-card class="box-card" shadow="hover" style="margin-bottom:20px" v-for=" item in blogList"
                :key="item.id">
                <template #header>
                    <div class="article-list-item-header">
                        <h3>{{item.title}}</h3>
                        <div>
                            <el-button @click="toUpdatePage(item.id)" type="info">修改</el-button>
                            <el-button @click="DeleteBlog(item.id)" type="danger">删除</el-button>
                        </div>
                    </div>
                </template>
                <div style="margin-bottom: 10px;">{{adddiandiandian(item.content)}}</div>
                <div style="font-size: 12px;opacity: 0.6;">{{formatDate(item.create_time)}}</div>
            </el-card>
            <el-pagination background layout="prev, pager, next" v-model:page-size="pageInfo.pageSize"
                v-model:current-page="pageInfo.page" :total="pageInfo.total" />
        </el-tab-pane>
        <!-- 2.添加文章 -->
        <el-tab-pane label="添加文章" name="add">
            <p class="text">标题</p>
            <el-input v-model="title" placeholder="请输入标题" clearable />
            <p class="text">分类</p>
            <el-select v-model="category_id" clearable placeholder="Select">
                <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <p class="text">内容</p>
            <RichTextEditor @changeContent="getContent" />
            <div id="submit-box">
                <el-button @click="submitBlog" size="large" id="submitbtn" type="primary" plain>提交</el-button>
            </div>
        </el-tab-pane>
        <!-- 3.修改文章 -->
        <el-tab-pane label="修改文章" name="update">
            <p class="text">标题</p>
            <el-input v-model="UpdatePageInfo.title" placeholder="请输入标题" clearable />
            <p class="text">分类</p>
            <el-select v-model="UpdatePageInfo.category_id" clearable placeholder="Select">
                <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <p class="text">内容</p>
            <RichTextEditor @changeContent="getContent" :UpdatePageInfoContent="UpdatePageInfo.content" />
            <div id="submit-box">
                <el-button @click="UpdateBlog" size="large" id="submitbtn" type="primary" plain>提交</el-button>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>
<script setup>
import { ref, onMounted, reactive, watch } from 'vue'
import RichTextEditor from "../../components/RichTextEditor.vue";
import { GetCategoryListRequest, PostAddBlogRequest, GetBlogListRequest, GetBlogDetailRequest, PutUpdateBlogRequest, DeleteBlogRequest } from "../../api";
import { ElMessage, ElMessageBox } from 'element-plus'
// 当前切换栏
const activeTab = ref('list')
// -------------1.文章列表区域---------------------
const blogList = reactive([])
// 获取博客列表
const GetBlogList = async () => {
    let query = {
        keyword: "",
        categoryid: "",
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
    let newHtml = content.replace(/<[^>]+>/gi, "")
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
// 点击修改跳转到修改页
const toUpdatePage = (id) => {
    activeTab.value = "update"
    GetBlogDetail(id)
    GetBlogList()
}
// 点击删除删除blog
const DeleteBlog = (id) => {
    ElMessageBox.confirm(
        '确定删除博客吗?',
        '删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            let { data, status } = await DeleteBlogRequest(id)
            if (data.code !== 200 || status !== 200) {
                throw ("修改失败")
            } else {
                GetBlogList()
            }
        })
        .then(() => {
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '删除失败',
            })
        })
}
// -------------2.添加文章区域---------------------
// 标题输入框
const title = ref('')
// 分类值
const category_id = ref('')
// 文章内容
const content = ref("")
// 分类选项
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
// 提交博客
const submitBlog = async () => {
    let { data, status } = await PostAddBlogRequest(title.value, category_id.value, content.value)
    if (data.code === 200 && status === 200) {
        ElMessage.success('提交成功')
        location.reload();
    } else {
        ElMessage.error('提交失败')
    }
}
// 自定义事件获取content值
const getContent = (html) => {
    if (activeTab.value === "add") {
        content.value = html
    } else if (activeTab.value === "update") {
        UpdatePageInfo.content = html
    }
}
// -------------3.修改文章区域---------------------
const UpdatePageInfo = reactive({
    id: "",
    title: "",
    category_id: "",
    content: ""
})
// 获取文章详情页
const GetBlogDetail = async (id) => {
    let { data, status } = await GetBlogDetailRequest(id)
    if (data.code === 200 && status === 200) {
        UpdatePageInfo.title = data.rows[0].title
        UpdatePageInfo.category_id = data.rows[0].category_id
        UpdatePageInfo.content = data.rows[0].content
        UpdatePageInfo.id = data.rows[0].id
    } else {
        ElMessage.error('获取详情页失败')
    }
}
// 更新博客
const UpdateBlog = async () => {
    let { data, status } = await PutUpdateBlogRequest({
        id: UpdatePageInfo.id,
        title: UpdatePageInfo.title,
        category_id: UpdatePageInfo.category_id,
        content: UpdatePageInfo.content
    })
    if (data.code === 200 && status === 200) {
        ElMessage.success('更新成功')
    } else {
        ElMessage.error('更新失败')
    }
}

onMounted(() => {
    GetCategoryList()
    GetBlogList()
    watch(() => pageInfo.page, () => {
        GetBlogList()
    })
})



</script>
<style lang="less">
.article-list-item-header {
    display: flex;
    justify-content: space-between;
}

#submit-box {
    display: flex;
    justify-content: center;

    #submitbtn {
        margin: 10px;
    }
}
</style>
  