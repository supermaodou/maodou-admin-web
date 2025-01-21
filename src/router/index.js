import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';
import About from '../views/About.vue';
import Settings from '../views/Settings.vue';
import Profile from '../views/settings/Profile.vue';
import Security from '../views/settings/Security.vue';
import System from '../views/System.vue';
import User from '../views/system/User.vue';
import Role from '../views/system/Role.vue';
import Menu from '../views/system/Menu.vue';

const routes = [
    {
        path: '/',
        redirect: '/login', // 默认重定向到登录页面
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true }, // 需要登录才能访问
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: Dashboard,
                meta: { requiresAuth: true }, // 需要登录才能访问
            },
            {
                path: '/about',
                name: 'About',
                component: About,
                meta: { requiresAuth: true }, // 需要登录才能访问
            },
            // 系统管理
            {
                path: '/system',
                name: 'System',
                component: System,
                meta: { requiresAuth: true }, // 需要登录才能访问
                children: [
                    {
                        path: 'user',
                        name: 'User',
                        component: User,
                    },
                    {
                        path: 'role',
                        name: 'Role',
                        component: Role,
                    },
                    {
                        path: 'menu',
                        name: 'Menu',
                        component: Menu,
                    },
                ],
            },
            // 设置
            {
                path: '/settings',
                name: 'Settings',
                component: Settings,
                meta: { requiresAuth: true }, // 需要登录才能访问
                children: [
                    {
                        path: 'profile',
                        name: 'Profile',
                        component: Profile,
                    },
                    {
                        path: 'security',
                        name: 'Security',
                        component: Security,
                    },
                ],
            },
        ]
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 路由守卫：检查用户是否登录
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated'); // 检查登录状态
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login'); // 未登录则跳转到登录页面
    } else {
        next(); // 已登录则继续导航
    }
});

export default router;