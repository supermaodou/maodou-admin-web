<template>
  <el-aside :width="isCollapse ? '64px' : '200px'" style="background-color: #304156; transition: width 0.3s;">
    <!-- 菜单栏顶部标题 -->
    <div class="menu-header">
      <el-icon v-if="isCollapse" :size="24" style="color: white;">
        <HomeFilled />
      </el-icon>
      <h2 v-else style="color: white; text-align: center; padding: 20px 0;">管理系统</h2>
    </div>
    <!-- 菜单栏 -->
    <el-menu :default-active="activeMenu" background-color="#304156" text-color="#fff"
      active-text-color="#ffd04b" @select="handleMenuSelect" :collapse="isCollapse">
      <template v-for="menu in menus" :key="menu.path">
        <el-menu-item v-if="!menu.children || menu.children.length === 0" :index="menu.path">
          <component class="icon-component" :is="menu.icon" />
          <span>{{ menu.title }}</span>
        </el-menu-item>
        <el-sub-menu v-else :index="menu.path">
          <template #title>
            <component class="icon-component" :is="menu.icon" />
            <span>{{ menu.title }}</span>
          </template>
          <el-menu-item v-for="child in menu.children" :key="child.path" :index="child.path">
            <component class="icon-component" :is="child.icon" />
            <span>{{ child.title }}</span>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    },
    activeMenu: {
      type: String,
      required: true
    }
  },
  computed: {
    menus() {
      return this.$store.getters.getMenus;
    }
  },
  methods: {
    handleMenuSelect(path) {
      this.$emit('menu-select', path);
    }
  }
}
</script>

<style scoped>
.menu-header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid #263445;
}

.icon-component {
  width: 1em;
  height: 1em;
  margin-right: 8px;
}
</style>