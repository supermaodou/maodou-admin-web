<template>
    <el-container style="height: 100vh; width: 100vw;">
        <!-- 左侧菜单栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'" style="background-color: #304156; transition: width 0.3s;">
            <!-- 菜单栏顶部标题 -->
            <div class="menu-header">
                <el-icon v-if="isCollapse" :size="24" style="color: white;">
                    <HomeFilled /> <!-- 收起时显示的图标 -->
                </el-icon>
                <h2 v-else style="color: white; text-align: center; padding: 20px 0;">管理系统</h2>
            </div>
            <!-- 菜单栏 -->
            <el-menu :default-active="activeMenu" background-color="#304156" text-color="#fff"
                active-text-color="#ffd04b" @select="handleMenuSelect" :collapse="isCollapse">
                <!-- 动态生成菜单 -->
                <template v-for="menu in menus" :key="menu.path">
                    <!-- 一级菜单 -->
                    <el-menu-item v-if="!menu.children || menu.children.length === 0" :index="menu.path">
                        <component class="icon-component" :is="menu.icon" />
                        <span>{{ menu.title }}</span>
                    </el-menu-item>
                    <!-- 嵌套菜单 -->
                    <el-sub-menu v-else :index="menu.path">
                        <template #title>
                            <component class="icon-component" :is="menu.icon" />
                            <span>{{ menu.title }}</span>
                        </template>
                        <el-menu-item v-for="child in menu.children" :key="child.path" :index="child.path">
                            <component class="icon-component" :is="child.icon" />
                            <span>{{ child.title }}</span>
                        </el-menu-item>
                    </el-sub-menu>
                </template>
            </el-menu>
        </el-aside>

        <!-- 右侧内容区域 -->
        <el-container style="width: calc(100vw - 200px);">
            <!-- 顶部导航栏 -->
            <el-header class="header">
                <!-- 展开/收起按钮 -->
                <div class="collapse-button" @click="toggleCollapse">
                    <el-icon :size="20" style="color: #304156;">
                        <component :is="isCollapse ? 'Expand' : 'Fold'" />
                    </el-icon>
                </div>
                <!-- 面包屑 -->
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
                        {{ item.title }}
                    </el-breadcrumb-item>
                </el-breadcrumb>
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

            <!-- 标签页区域 -->
            <div class="tabs-container">
                <el-tabs v-model="activeTab" type="card" closable @tab-remove="handleTabRemove"
                    @tab-click="handleTabClick">
                    <el-tab-pane v-for="tab in tabs" :key="tab.path" :label="tab.title" :name="tab.path"></el-tab-pane>
                </el-tabs>
            </div>

            <!-- 主体内容 -->
            <el-main class="main-content">
                <router-view /> <!-- 嵌套路由的占位符 -->
            </el-main>

            <!-- 底部 -->
            <el-footer style="background-color: #FFFFFF; color: #304156; text-align: center; line-height: 60px;">
                版权所有 © 2023 管理系统
            </el-footer>
        </el-container>
    </el-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'Home',
    data() {
        return {
            activeMenu: this.$route.path, // 当前激活的菜单项
            userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            isCollapse: false, // 是否收起菜单栏
        };
    },
    computed: {
        ...mapState('tabs', ['tabs', 'activeTab']),
        // 动态获取用户名
        username() {
            return this.$store.getters.getUserInfo?.nickname || '未知用户';
        },
        // 动态获取菜单
        menus() {
            return this.$store.getters.getMenus;
        },
        // 动态生成面包屑
        breadcrumbs() {
            const breadcrumbs = [];
            const matchedRoutes = this.$route.matched;

            matchedRoutes.forEach((route) => {
                if (route.meta?.title) {
                    breadcrumbs.push({
                        path: route.path,
                        title: route.meta.title,
                    });
                }
            });

            return breadcrumbs;
        },
    },
    methods: {
        ...mapActions('tabs', ['addTab', 'removeTab', 'setActiveTab', 'closeOtherTabs', 'closeAllTabs']),
        // 处理菜单项选择
        handleMenuSelect(path) {
            this.$router.push(path);
        },
        // 处理标签页关闭
        handleTabRemove(path) {
            this.removeTab(path); // 从 Vuex 中移除标签页
            if (this.activeTab === path) {
                // 如果关闭的是当前激活的标签页
                const lastTab = this.tabs[this.tabs.length - 1];
                if (lastTab) {
                    this.$router.push(lastTab.path); // 跳转到上一个标签页
                } else {
                    this.$router.push('/dashboard'); // 如果没有其他标签页，跳转到首页
                }
            }
        },
        // 处理标签页点击
        handleTabClick(tab) {
            const path = tab.props.name; // 获取标签页的路由路径
            this.setActiveTab(path); // 调用 Vuex action 更新激活的标签页
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
        // 切换菜单栏展开/收起状态
        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
    },
    watch: {
        // 监听路由变化，更新激活的菜单项和标签页
        '$route.path': {
            handler(newPath) {
                this.activeMenu = newPath;
                const title = this.$route.meta?.title || '未命名';
                this.addTab({ path: newPath, title });
                this.setActiveTab(newPath);
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
    height: 100%;
    overflow: hidden;
}

#app {
    height: 100%;
}

.el-container {
    height: 100%;
    width: 100%;
}

.el-aside {
    height: 100%;
    overflow-y: auto;
}

.el-main {
    padding: 20px;
    height: calc(100vh - 120px); 
    /* 减去头部和底部的高度(各60px) */
    overflow-y: auto;
}

.icon-component {
    width: 1em;
    height: 1em;
    margin-right: 8px;
}

/* 顶部导航栏样式 */
.header {
    background-color: #FFFFFF;
    color: white;
    line-height: 60px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 0 20px;
}

/* 展开/收起按钮样式 */
.collapse-button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    cursor: pointer;
    margin-right: 20px;
}

.collapse-button:hover {
    background-color: #f5f7fa;
}

/* 面包屑样式 */
.el-breadcrumb {
    flex: 1;
    margin-left: 20px;
}

/* 菜单栏顶部标题样式 */
.menu-header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    border-bottom: 1px solid #263445;
}

/* 标签页区域样式 */
.tabs-container {
    background-color: #ffffff;
    padding: 0 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 调整标签页高度和样式 */
.el-tabs {
    margin-top: 0;
}

.el-tabs--card>.el-tabs__header {
    margin: 0;
}

.el-tabs--card>.el-tabs__header .el-tabs__item {
    height: 40px;
    /* 调整标签页高度 */
    line-height: 40px;
    /* 调整标签页文字垂直居中 */
    font-size: 14px;
    /* 调整标签页文字大小 */
    padding: 0 20px;
    /* 调整标签页内边距 */
}

.el-tabs--card>.el-tabs__header .el-tabs__nav {
    border: none;
    /* 移除默认边框 */
}

.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    background-color: #f5f7fa;
    /* 激活标签页的背景色 */
    border-bottom-color: #f5f7fa;
    /* 激活标签页的底部边框颜色 */
}

/* 主体内容样式 */
.main-content {
    padding: 15px;
    height: calc(100vh - 120px);
    /* 减去顶部导航栏和标签页区域的高度 */
    overflow: auto;
    background-color: #f5f7fa;
}

/* .el-header, .el-footer {
    height: 60px;
    padding: 0 20px;
} */
</style>