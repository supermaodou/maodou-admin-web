<template>
  <el-header class="header">
    <div class="collapse-button" @click="$emit('toggle-collapse')">
      <el-icon :size="20" style="color: #304156;">
        <component :is="isCollapse ? 'Expand' : 'Fold'" />
      </el-icon>
    </div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
        {{ item.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown @command="handleCommand">
      <div style="display: flex; align-items: center; cursor: pointer;">
        <el-avatar :size="40" :src="avatar" style="margin-right: 10px;"></el-avatar>
        <span>{{ username }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-header>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    isCollapse: Boolean,
    breadcrumbs: Array,
    username: String,
    avatar: String
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        this.$emit('logout');
      }
    }
  }
}
</script>

<style scoped>
.header {
  background-color: #FFFFFF;
  color: #303133;
  line-height: 60px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  height: 60px;
}

.collapse-button {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.collapse-button:hover {
  background-color: #f5f7fa;
}

.el-breadcrumb {
  flex: 1;
  margin-left: 20px;
}
</style>