import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const routes = [
    {
        path: '/',
        redirect: '/login', // 默认重定向到登录页面
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: { hidden: true }, // 隐藏菜单
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { requiresAuth: true, title: '首页', icon: 'el-icon-menu' }, // 需要登录才能访问
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('../views/Dashboard.vue'),
                meta: { requiresAuth: true, title: '仪表盘', icon: 'el-icon-data-line' },
            },
            // 系统管理
            {
                path: '/system',
                name: 'System',
                meta: { requiresAuth: true, title: '系统管理', icon: 'el-icon-setting' },
                children: [
                    {
                        path: 'user',
                        name: 'User',
                        component: () => import('../views/system/User.vue'),
                        meta: { title: '用户管理', icon: 'el-icon-user' },
                    },
                    {
                        path: 'role',
                        name: 'Role',
                        component: () => import('../views/system/Role.vue'),
                        meta: { title: '角色管理', icon: 'el-icon-s-custom' },
                    },
                    {
                        path: 'menu',
                        name: 'Menu',
                        component: () => import('../views/system/Menu.vue'),
                        meta: { title: '菜单管理', icon: 'el-icon-menu' },
                    },
                    {
                        path: 'dict',
                        name: 'Dict',
                        component: () => import('../views/system/Dict.vue'),
                        meta: { title: '字典管理', icon: 'el-icon-collection' },
                    },
                ],
            },
            // 个人设置
            {
                path: '/settings',
                name: 'Settings',
                meta: { requiresAuth: true, title: '个人设置', icon: 'el-icon-setting' },
                children: [
                    {
                        path: 'profile',
                        name: 'Profile',
                        component: () => import('../views/settings/Profile.vue'),
                        meta: { title: '个人资料', icon: 'el-icon-user' },
                    },
                    {
                        path: 'security',
                        name: 'Security',
                        component: () => import('../views/settings/Security.vue'),
                        meta: { title: '安全设置', icon: 'el-icon-lock' },
                    },
                ],
            },
            {
                path: '/about',
                name: 'About',
                component: () => import('../views/About.vue'),
                meta: { requiresAuth: true, title: '关于', icon: 'el-icon-document' },
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*', // 通配符路由，匹配所有未定义的路由
        name: 'NotFound',
        component: () => import('../views/NotFound.vue'),
        meta: { hidden: true }, // 隐藏菜单
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 路由守卫：检查用户是否登录
router.beforeEach((to, from, next) => {
    // const isAuthenticated = !!store.getters.getUserInfo; // 通过 store 访问 Vuex
    const isAuthenticated = !!store.state.userInfo; // 检查 Vuex 中是否有用户信息
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login'); // 未登录则跳转到登录页面
    } else {
        next(); // 已登录则继续导航
    }
});

export default router;