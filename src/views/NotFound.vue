<template>
  <div class="not-found">
    <div class="content">
      <h1 class="error-code">404</h1>
      <div class="error-desc">
        <h2>抱歉，页面未找到</h2>
        <p>您访问的页面不存在或已被删除</p>
      </div>
      <el-button type="primary" size="large" @click="goHome" class="back-btn">
        <el-icon><Back /></el-icon>返回首页
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goHome() {
      this.$router.push('/dashboard');
    },
  },
};
</script>

<style scoped>
.not-found {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.content {
  text-align: center;
  padding: 40px;
}

.error-code {
  font-size: 120px;
  color: var(--el-color-primary);
  margin: 0;
  line-height: 1;
  font-weight: bold;
  text-shadow: 4px 4px 0 #e6e9ee;
}

.error-desc {
  margin: 30px 0 40px;
}

.error-desc h2 {
  font-size: 24px;
  color: #303133;
  margin: 0 0 15px;
  font-weight: 500;
}

.error-desc p {
  font-size: 16px;
  color: #909399;
  margin: 0;
}

.back-btn {
  padding: 12px 25px;
  font-size: 16px;
}

.back-btn :deep(.el-icon) {
  margin-right: 8px;
}
</style>