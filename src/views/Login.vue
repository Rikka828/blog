<template>
    <div class="container">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>login</span>
                </div>
            </template>
            <el-form label-position="top" label-width="100px" :model="formLabelAlign" status-icon :rules="loginRules">
                <el-form-item label="account" prop="account">
                    <el-input type="text" v-model="formLabelAlign.account" />
                </el-form-item>
                <el-form-item label="password" prop="password">
                    <el-input type="password" v-model="formLabelAlign.password" />
                </el-form-item>
                <el-form-item class="login-footer">
                    <el-checkbox v-model="checkedbox" label="rember" name="type" />
                    <el-button type="primary" @click="onSubmit">login</el-button>
                    <el-link type="primary" @click="router.push('/register')">to register</el-link>
                </el-form-item>
            </el-form>
        </el-card>
    </div>

</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'
import { PostAdminLoginRequest } from "../api/index";
import { ElMessage } from 'element-plus'
import { Store } from '../store'
const router = useRouter()
const store = Store()
const checkedbox = ref(true)
// 收集表单数据
const formLabelAlign = reactive({
    account: '',
    password: '',
})
// 自定义规则
let loginRules = {
    account: [
        { required: true, message: '账号不能为空', trigger: 'blur' },
        { min: 2, max: 12, message: '账号应为6-16位的长度', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 6, max: 16, message: '密码应为6-16位的长度', trigger: 'blur' }
    ]
}
const onSubmit = async () => {
    let { data, status } = await PostAdminLoginRequest(formLabelAlign.account, formLabelAlign.password)
    if (data.code === 200 && status === 200) {
        store.token = data.data.token
        if (checkedbox) {
            localStorage.setItem("token", store.token)
        }
        ElMessage.success('登陆成功')
        router.push("/home")
    } else {
        ElMessage.error('登陆失败')
    }
}
</script>

<style lang='less' scoped>
.container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .box-card {
        width: 480px;

        .card-header {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .login-footer {
        /deep/ .el-form-item__content {
            justify-content: space-between !important;
        }
    }

}
</style>