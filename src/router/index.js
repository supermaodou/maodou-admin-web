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
        component: import('../views/Login.vue'),
    },
    {
        path: '/home',
        name: 'Home',
        component: import('../views/Home.vue'),
        meta: { requiresAuth: true }, // 需要登录才能访问
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: import('../views/Dashboard.vue'),
                meta: { requiresAuth: true }, // 需要登录才能访问
            },
            {
                path: '/about',
                name: 'About',
                component: import('../views/About.vue'),
                meta: { requiresAuth: true }, // 需要登录才能访问
            },
            // 系统管理
            {
                path: '/system',
                name: 'System',
                component: import('../views/System.vue'),
                meta: { requiresAuth: true }, // 需要登录才能访问
                children: [
                    {
                        path: 'user',
                        name: 'User',
                        component: import('../views/system/User.vue'),
                    },
                    {
                        path: 'role',
                        name: 'Role',
                        component: import('../views/system/Role.vue'),
                    },
                    {
                        path: 'menu',
                        name: 'Menu',
                        component: import('../views/system/Menu.vue'),
                    },
                ],
            },
            // 设置
            {
                path: '/settings',
                name: 'Settings',
                component: import('../views/Settings.vue'),
                meta: { requiresAuth: true }, // 需要登录才能访问
                children: [
                    {
                        path: 'profile',
                        name: 'Profile',
                        component: import('../views/settings/Profile.vue'),
                    },
                    {
                        path: 'security',
                        name: 'Security',
                        component: import('../views/settings/Security.vue'),
                    },
                ],
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*', // 通配符路由，匹配所有未定义的路由
        name: 'NotFound',
        component: import('../views/NotFound.vue'),
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