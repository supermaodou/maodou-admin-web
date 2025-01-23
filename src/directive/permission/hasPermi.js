import store from '../../store'; // 引入 Vuex Store

export default {
  mounted(el, binding) {
    const { value } = binding; // 获取指令的值，例如 ['system:user:edit']
    const permissions = store.getters.getPermissions; // 获取当前用户的权限列表

    if (value && Array.isArray(value) && value.length > 0) {
      const hasPermission = value.every((permission) => permissions.includes(permission));

      // 如果没有权限，则移除元素
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error('v-hasPermi 指令需要传入一个权限数组，例如 v-hasPermi="[\'system:user:edit\']"');
    }
  },
};