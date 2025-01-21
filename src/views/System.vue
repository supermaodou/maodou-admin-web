<template>
    <div>
      <!-- <h2>系统管理</h2>
      <el-menu
        mode="horizontal"
        :default-active="activeSubMenu"
        @select="handleSubMenuSelect"
      >
        <el-menu-item index="/system/user">用户管理</el-menu-item>
        <el-menu-item index="/system/role">角色管理</el-menu-item>
        <el-menu-item index="/system/menu">菜单管理</el-menu-item>
      </el-menu> -->
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