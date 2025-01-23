import { createStore } from 'vuex';

// 从 localStorage 中恢复状态
const storedUserInfo = JSON.parse(localStorage.getItem('userInfo')) || null;
const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
const storedRoles = JSON.parse(localStorage.getItem('roles')) || [];

const store = createStore({
    state: {
        userInfo: storedUserInfo, // 用户信息
        permissions: storedPermissions, // 权限列表
        roles: storedRoles, // 角色列表
        menus: [], // 菜单列表
    },
    mutations: {
        // 设置用户信息、权限和角色
        SET_USER_INFO(state, userInfo) {
            state.userInfo = userInfo;
            state.permissions = userInfo.permissions || [];
            state.roles = userInfo.roles || [];

            // 动态生成菜单
            state.menus = generateMenus(state.roles);

            // 将状态存储到 localStorage
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            localStorage.setItem('permissions', JSON.stringify(state.permissions));
            localStorage.setItem('roles', JSON.stringify(state.roles));
            localStorage.setItem('menus', JSON.stringify(state.menus));
        },
        // 清除用户信息、权限和角色
        CLEAR_USER_INFO(state) {
            state.userInfo = null;
            state.permissions = [];
            state.roles = [];
            state.menus = [];

            // 清除 localStorage
            localStorage.removeItem('userInfo');
            localStorage.removeItem('permissions');
            localStorage.removeItem('roles');
            localStorage.removeItem('menus');
        },
    },
    actions: {
        // 登录
        login({ commit }, userInfo) {
            commit('SET_USER_INFO', userInfo);
        },
        // 登出
        logout({ commit }) {
            commit('CLEAR_USER_INFO');
        },
    },
    getters: {
        // 获取用户信息
        getUserInfo: (state) => state.userInfo,
        // 获取权限列表
        getPermissions: (state) => state.permissions,
        // 获取角色列表
        getRoles: (state) => state.roles,
        // 获取菜单列表
        getMenus: (state) => state.menus,
    },
});

// 根据角色动态生成菜单
function generateMenus(roles) {
    const menus = [];

    // 管理员菜单
    if (roles.includes('admin')) {
        menus.push(
            {
                path: '/dashboard',
                name: 'Dashboard',
                icon: 'Menu',
                title: '仪表盘',
            },
            {
                path: '/system',
                name: 'System',
                icon: 'Setting',
                title: '系统管理',
                children: [
                    {
                        path: '/system/user',
                        name: 'User',
                        icon: 'User',
                        title: '用户管理',
                    },
                    {
                        path: '/system/role',
                        name: 'Role',
                        icon: 'UserFilled',
                        title: '角色管理',
                    },
                    {
                        path: '/system/menu',
                        name: 'Menu',
                        icon: 'Menu',
                        title: '菜单管理',
                    },
                ],
            },
            {
                path: '/settings',
                name: 'Settings',
                icon: 'Setting',
                title: '个人设置',
                children: [
                    {
                        path: '/settings/profile',
                        name: 'Profile',
                        icon: 'User',
                        title: '个人资料',
                    },
                    {
                        path: '/settings/security',
                        name: 'Security',
                        icon: 'Lock',
                        title: '安全设置',
                    }
                ],
            },
            {
                path: '/about',
                name: 'About',
                icon: 'Document',
                title: '关于',
            },
        );
    }

    // 普通用户菜单
    if (roles.includes('user')) {
        menus.push(
            {
                path: '/dashboard',
                name: 'Dashboard',
                icon: 'el-icon-menu',
                title: '首页',
            },
            {
                path: '/settings',
                name: 'Settings',
                icon: 'el-icon-setting',
                title: '设置',
                children: [
                    {
                        path: '/settings/profile',
                        name: 'Profile',
                        icon: 'el-icon-user',
                        title: '个人资料',
                    },
                    {
                        path: '/settings/security',
                        name: 'Security',
                        icon: 'el-icon-lock',
                        title: '安全设置',
                    }
                ],
            },
        );
    }

    return menus;
}

export default store;