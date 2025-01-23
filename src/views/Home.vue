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
                <!-- 用户信息 -->
                <el-dropdown>
                    <div style="display: flex; align-items: center; cursor: pointer;">
                        <el-avatar :size="40" :src="userAvatar" style="margin-right: 10px;"></el-avatar>
                        <span>{{ username }}</span>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
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
            userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', // 用户头像
        };
    },
    computed: {
        // 动态获取用户名
        username() {
            return this.$store.getters.getUserInfo?.nickname || '未知用户';
        },
    },
    methods: {
        // 处理菜单项选择
        handleMenuSelect(path) {
            this.$router.push(path); // 跳转到对应路由
        },
        // 处理退出登录
        handleLogout() {
            this.$confirm('确定要退出登录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$store.dispatch('logout'); // 调用 Vuex Action 清除用户信息
                this.$router.push('/login'); // 跳转到登录页面
            });
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

.el-main {
    padding: 0;
    /* 移除默认的内边距 */
    height: calc(100vh - 60px);
    /* 减去头部高度 */
    overflow: auto;
    /* 如果内容超出屏幕，显示滚动条 */
}
</style>