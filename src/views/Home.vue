<template>
    <el-container style="height: 100vh;">
        <!-- 侧边栏 -->
        <el-aside width="200px" style="background-color: #304156;">
            <h2 style="color: white; text-align: center; padding: 20px 0;">管理系统</h2>
            <el-menu :default-active="activeMenu" background-color="#304156" text-color="#fff"
                active-text-color="#ffd04b" @select="handleMenuSelect">
                <el-menu-item index="/dashboard">
                    <i class="el-icon-menu"></i>
                    <span>首页</span>
                </el-menu-item>
                <el-menu-item index="/about">
                    <i class="el-icon-document"></i>
                    <span>关于</span>
                </el-menu-item>
                <el-sub-menu index="/system">
                    <template #title>
                        <i class="el-icon-setting"></i>
                        <span>系统管理</span>
                    </template>
                    <el-menu-item index="/system/user">用户管理</el-menu-item>
                    <el-menu-item index="/system/role">角色管理</el-menu-item>
                    <el-menu-item index="/system/menu">菜单管理</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="/settings">
                    <template #title>
                        <i class="el-icon-setting"></i>
                        <span>设置</span>
                    </template>
                    <el-menu-item index="/settings/profile">个人资料</el-menu-item>
                    <el-menu-item index="/settings/security">安全设置</el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>

        <!-- 主容器 -->
        <el-container>
            <!-- 头部 -->
            <el-header
                style="background-color: #409EFF; color: white; line-height: 60px; display: flex; justify-content: space-between; align-items: center;">
                <span>管理系统</span>
                <el-button type="primary" style="color: white;" @click="handleLogout">退出登录</el-button>
            </el-header>

            <!-- 主体内容 -->
            <el-main>
                <router-view /> <!-- 路由占位符 -->
            </el-main>

            <!-- 底部 -->
            <el-footer style="background-color: #409EFF; color: white; text-align: center; line-height: 60px;">
                版权所有 © 2023 管理系统
            </el-footer>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            // 当前激活的菜单项
            activeMenu: '/dashboard',
        };
    },
    methods: {
        // 处理菜单项选择
        handleMenuSelect(path) {
            this.$router.push(path); // 跳转到对应路由
        },
        // 处理退出登录
        handleLogout() {
            localStorage.removeItem('isAuthenticated'); // 清除登录状态
            this.$router.push('/login'); // 跳转到登录页面
        },
    },
    watch: {
        // 监听路由变化，更新激活的菜单项
        '$route.path': {
            handler(newPath) {
                this.activeMenu = newPath;
            },
            immediate: true,
        },
    },
    created() {
        // 初始化时设置当前激活的菜单项
        this.activeMenu = this.$route.path;
    },
};
</script>

<style>
body,
html {
    margin: 0;
    padding: 0;
}
</style>