<template>
    <div class="container">
        <el-table :data="filterTableData" style="width: 100%" border >
            <el-table-column label="编号" prop="id" />
            <el-table-column label="名称" prop="name" />
            <el-table-column align="right">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search" />
                </template>
                <template #default="scope">
                    <el-button size="small" @click="ToEdit(scope.row.id)">修改</el-button>
                    <el-button size="small" type="danger" @click="ToDelete(scope.row.id)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="footer">
            <el-button type="primary" plain @click="ToAdd">添加</el-button>
        </div>
    </div>

</template>

<script setup>

import { computed, ref, reactive, onMounted } from 'vue'
import { GetCategoryListRequest, PutUpdateCategoryRequest, DeleteCategoryRequest,PostAddCategoryRequest } from "../../api/index";
import { ElMessage, ElMessageBox } from 'element-plus'

const search = ref('')
const filterTableData = computed(() =>
    tableData.filter(
        (data) => !search.value || data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)
const tableData = reactive([

])
// 去修改
const ToEdit = (id) => {
    ElMessageBox.prompt('输入新名称', '编辑', {
        confirmButtonText: '完成',
        cancelButtonText: '取消',
        inputPattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,50}$/,
        inputErrorMessage: '格式错误',
    })
        .then(async ({ value }) => {
            let { data, status } = await PutUpdateCategoryRequest(id, value)
            if (data.code !== 200 || status !== 200) {
                throw ("修改失败")
            } else {
                GetCategoryList()
            }
        })
        .then(() => {
            ElMessage({
                type: 'success',
                message: `修改成功`,
            })
        })
        .catch(() => {
            ElMessage({
                type: 'error',
                message: '修改失败',
            })
        })
}
// 去删除
const ToDelete = (id) => {
    ElMessageBox.confirm(
        '确定删除分类记录?',
        '删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            let { data, status } = await DeleteCategoryRequest(id)
            if (data.code !== 200 || status !== 200) {
                throw ("修改失败")
            } else {
                GetCategoryList()
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
// 去增加
const ToAdd = ()=>{
    ElMessageBox.prompt('输入分类名称', '添加分类', {
        confirmButtonText: '完成',
        cancelButtonText: '取消',
        inputPattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,50}$/,
        inputErrorMessage: '格式错误',
    })
        .then(async ({ value }) => {
            let { data, status } = await PostAddCategoryRequest(value)
            if (data.code !== 200 || status !== 200) {
                throw ("修改失败")
            } else {
                GetCategoryList()
            }
        })
        .then(() => {
            ElMessage({
                type: 'success',
                message: `添加成功`,
            })
        })
        .catch(() => {
            ElMessage({
                type: 'error',
                message: '添加失败',
            })
        })
}
// 获取分类列表
const GetCategoryList = async () => {
    let { data, status } = await GetCategoryListRequest()
    if (data.code === 200 && status === 200) {
        tableData.splice(0)
        data.data.forEach(item => {
            tableData.push(item)
        });
    } else {
        ElMessage.error('获取列表失败')
    }
}

onMounted(() => {
    GetCategoryList()
})

</script>

<style lang='less' scoped>
.container {
    display: flex;
    flex-direction: column;

    .footer {
        display: flex;
        justify-content: left;
        padding: 10px;
    }
}
</style>