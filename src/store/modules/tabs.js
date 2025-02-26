const state = {
    tabs: [], // 标签页列表
    activeTab: '', // 当前激活的标签页
};

const mutations = {
    // 添加标签页
    ADD_TAB(state, tab) {
        const exists = state.tabs.some((t) => t.path === tab.path);
        if (!exists) {
            state.tabs.push(tab);
        }
        state.activeTab = tab.path;
    },
    // 移除标签页
    REMOVE_TAB(state, path) {
        state.tabs = state.tabs.filter((tab) => tab.path !== path);
        if (state.activeTab === path) {
            // 如果移除的是当前激活的标签页
            const lastTab = state.tabs[state.tabs.length - 1];
            state.activeTab = lastTab ? lastTab.path : '';
        }
    },
    // 设置激活的标签页
    SET_ACTIVE_TAB(state, path) {
        state.activeTab = path;
    },
    // 关闭其他标签页
    CLOSE_OTHER_TABS(state, path) {
        state.tabs = state.tabs.filter((tab) => tab.path === path);
        state.activeTab = path;
    },
    // 关闭全部标签页
    CLOSE_ALL_TABS(state) {
        state.tabs = [];
        state.activeTab = '';
    },
};

const actions = {
    addTab({ commit }, tab) {
        commit('ADD_TAB', tab);
    },
    removeTab({ commit }, path) {
        commit('REMOVE_TAB', path);
    },
    setActiveTab({ commit }, path) {
        commit('SET_ACTIVE_TAB', path);
    },
    closeOtherTabs({ commit }, path) {
        commit('CLOSE_OTHER_TABS', path);
    },
    closeAllTabs({ commit }) {
        commit('CLOSE_ALL_TABS');
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};