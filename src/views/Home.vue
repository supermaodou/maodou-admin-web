<template>
    <el-container style="height: 100vh;">
        <!-- 左侧菜单栏 -->
        <el-aside width="200px" style="background-color: #304156;">
            <h2 style="color: white; text-align: center; padding: 20px 0;">管理系统</h2>
            <el-menu :default-active="activeMenu" background-color="#304156" text-color="#fff"
                active-text-color="#ffd04b" @select="handleMenuSelect">
                <!-- 动态生成菜单 -->
                <template v-for="menu in menus" :key="menu.path">
                    <!-- 一级菜单 -->
                    <el-menu-item v-if="!menu.children || menu.children.length === 0" :index="menu.path">
                        <i :class="menu.icon"></i>
                        <span>{{ menu.title }}</span>
                    </el-menu-item>
                    <!-- 嵌套菜单 -->
                    <el-sub-menu v-else :index="menu.path">
                        <template #title>
                            <i :class="menu.icon"></i>
                            <span>{{ menu.title }}</span>
                        </template>
                        <el-menu-item v-for="child in menu.children" :key="child.path" :index="child.path">
                            <i :class="child.icon"></i>
                            <span>{{ child.title }}</span>
                        </el-menu-item>
                    </el-sub-menu>
                </template>
            </el-menu>
        </el-aside>

        <!-- 右侧内容区域 -->
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
                <router-view /> <!-- 嵌套路由的占位符 -->
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            activeMenu: this.$route.path, // 当前激活的菜单项
            userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        };
    },
    computed: {
        // 动态获取用户名
        username() {
            return this.$store.getters.getUserInfo?.nickname || '未知用户';
        },
        // 动态获取菜单
        menus() {
            return this.$store.getters.getMenus;
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