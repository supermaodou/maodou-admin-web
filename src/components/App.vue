<template>
    <el-container style="height: 100vh;">
        <!-- 侧边栏 -->
        <el-aside width="200px" style="background-color: #304156;">
            <h2 style="color: white; text-align: center; padding: 20px 0;">管理系统</h2>
            <el-menu :default-active="activeMenu" background-color="#304156" text-color="#fff"
                active-text-color="#ffd04b" @select="handleMenuSelect">
                <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
                    <i :class="item.icon"></i>
                    <span>{{ item.title }}</span>
                </el-menu-item>
            </el-menu>
        </el-aside>

        <!-- 主容器 -->
        <el-container>
            <!-- 头部 -->
            <el-header style="background-color: #409EFF; color: white; line-height: 60px;">
                <span>管理系统</span>
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
    name: 'App',
    data() {
        return {
            // 当前激活的菜单项
            activeMenu: '/',
            // 菜单数据
            menuItems: [
                {
                    path: '/',
                    title: '首页',
                    icon: 'el-icon-menu',
                },
                {
                    path: '/about',
                    title: '关于',
                    icon: 'el-icon-document',
                },
                {
                    path: '/settings',
                    title: '设置',
                    icon: 'el-icon-setting',
                },
            ],
        };
    },
    methods: {
        // 处理菜单项选择
        handleMenuSelect(path) {
            this.$router.push(path); // 跳转到对应路由
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