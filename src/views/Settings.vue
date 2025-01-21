<template>
    <div>
      <h2>设置</h2>
      <el-menu
        mode="horizontal"
        :default-active="activeSubMenu"
        @select="handleSubMenuSelect"
      >
        <el-menu-item index="/settings/profile">个人资料</el-menu-item>
        <el-menu-item index="/settings/security">安全设置</el-menu-item>
      </el-menu>
      <router-view /> <!-- 嵌套路由的占位符 -->
    </div>
  </template>
  
  <script>
  export default {
    name: 'Settings',
    data() {
      return {
        activeSubMenu: this.$route.path, // 当前激活的子菜单项
      };
    },
    methods: {
      // 处理子菜单项选择
      handleSubMenuSelect(path) {
        this.$router.push(path); // 跳转到对应子路由
      },
    },
    watch: {
      // 监听路由变化，更新激活的子菜单项
      '$route.path': {
        handler(newPath) {
          this.activeSubMenu = newPath;
        },
        immediate: true,
      },
    },
  };
  </script>