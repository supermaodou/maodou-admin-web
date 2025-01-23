import store from '../../store'; // 引入 Vuex Store

export default {
  mounted(el, binding) {
    const { value } = binding; // 获取指令的值，例如 ['admin']
    const roles = store.getters.getRoles; // 获取当前用户的角色列表

    if (value && Array.isArray(value) && value.length > 0) {
      const hasRole = value.some((role) => roles.includes(role));

      // 如果没有角色，则移除元素
      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error('v-hasRole 指令需要传入一个角色数组，例如 v-hasRole="[\'admin\']"');
    }
  },
};