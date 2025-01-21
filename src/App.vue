<template>
  <router-view /> <!-- 路由占位符 -->
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
html, body, #app {
  width: 100%;
  height: 100%; /* 确保根元素填满屏幕 */
  margin: 0;
  padding: 0;
}
</style>