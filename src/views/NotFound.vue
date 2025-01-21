<template>
    <el-container style="height: 100vh; display: flex; align-items: center; justify-content: center;">
        <el-card style="width: 400px; text-align: center;">
            <h1>404</h1>
            <p>页面未找到</p>
            <el-button type="primary" @click="goHome">返回首页</el-button>
        </el-card>
    </el-container>
</template>

<script>
export default {
    name: 'NotFound',
    methods: {
        // 返回首页
        goHome() {
            this.$router.push('/dashboard');
        },
    },
};
</script>

<style scoped>
.el-card {
    padding: 20px;
}
</style>