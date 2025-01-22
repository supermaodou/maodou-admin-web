import { createStore } from 'vuex';

// 创建 Vuex Store
const store = createStore({
  state: {
    // 全局状态
    userList: [
      {
        id: 1,
        username: 'admin',
        nickname: '管理员',
        department: '技术部',
        phone: '13800138000',
        status: '1',
        createTime: '2023-10-01 12:00:00',
      },
      {
        id: 2,
        username: 'user1',
        nickname: '用户1',
        department: '市场部',
        phone: '13800138001',
        status: '0',
        createTime: '2023-10-02 12:00:00',
      },
    ],
  },
  mutations: {
    // 修改状态的方法
    ADD_USER(state, user) {
      state.userList.push(user);
    },
    DELETE_USER(state, id) {
      state.userList = state.userList.filter((user) => user.id !== id);
    },
    UPDATE_USER(state, updatedUser) {
      const index = state.userList.findIndex((user) => user.id === updatedUser.id);
      if (index !== -1) {
        state.userList.splice(index, 1, updatedUser);
      }
    },
  },
  actions: {
    // 异步操作
    addUser({ commit }, user) {
      commit('ADD_USER', user);
    },
    deleteUser({ commit }, id) {
      commit('DELETE_USER', id);
    },
    updateUser({ commit }, user) {
      commit('UPDATE_USER', user);
    },
  },
  getters: {
    // 计算属性
    getUserList: (state) => state.userList,
  },
});

export default store;