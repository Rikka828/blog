<template>
    <div class="container">
        <div class="sider">
            <h5 class="mb-2" @click="toPage('/home')">博客管理</h5>
            <el-menu v-model:default-active="menuAcitve" class="el-menu-vertical-demo">
                <el-menu-item index="/dashboard/article" @click="toPage('/dashboard/article')">
                    <el-icon>
                        <Document />
                    </el-icon>
                    <span>文章管理</span>
                </el-menu-item>
                <el-menu-item index="/dashboard/category" @click="toPage('/dashboard/category')">
                    <el-icon>
                        <icon-menu />
                    </el-icon>
                    <span>分类管理</span>
                </el-menu-item>
                <el-menu-item index="/login" @click="toPage('/login')">
                    <el-icon>
                        <CloseBold />
                    </el-icon>
                    <span>退出</span>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="main">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import { Document, Menu as IconMenu, CloseBold } from '@element-plus/icons-vue'
import { useRouter,useRoute } from "vue-router";
import { ref, onMounted } from "vue";
const router = useRouter()
const route = useRoute()
const toPage = (url) => {
    router.push(url)
}
const menuAcitve = ref("/dashboard/article")
onMounted(()=>{
    menuAcitve.value = route.path
})
</script>

<style lang='less' scoped>
.container {
    height: 100%;
    display: flex;

    .sider {
        display: flex;
        flex-direction: column;
        height: 100%;

        h5 {
            text-align: center;
            font-size: 20px;
            margin: 20px 0;
            cursor: pointer;
        }

        .el-menu-vertical-demo {
            flex: 1;
            width: 180px;
        }
    }

    .main {
        flex: 1;
        padding: 20px;
        overflow: scroll;
        overflow-x: hidden;
    }
}
</style>