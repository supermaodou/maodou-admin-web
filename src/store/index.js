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
  },
  mutations: {
    // 设置用户信息、权限和角色
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo;
      state.permissions = userInfo.permissions || [];
      state.roles = userInfo.roles || [];

      // 将状态存储到 localStorage
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('permissions', JSON.stringify(state.permissions));
      localStorage.setItem('roles', JSON.stringify(state.roles));
    },
    // 清除用户信息、权限和角色
    CLEAR_USER_INFO(state) {
      state.userInfo = null;
      state.permissions = [];
      state.roles = [];

      // 清除 localStorage
      localStorage.removeItem('userInfo');
      localStorage.removeItem('permissions');
      localStorage.removeItem('roles');
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
  },
});

export default store;