<template>
    <el-container style="height: 100vh; display: flex; align-items: center; justify-content: center;">
      <el-card style="width: 400px;">
        <h2 style="text-align: center;">登录</h2>
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" style="width: 100%;">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-container>
  </template>
  
  <script>
  export default {
    name: 'Login',
    data() {
      return {
        loginForm: {
          username: '',
          password: '',
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
        },
      };
    },
    methods: {
      // 处理登录
      handleLogin() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            // 模拟登录成功
            localStorage.setItem('isAuthenticated', 'true'); // 存储登录状态
            this.$router.push('/home'); // 跳转到首页
          } else {
            return false;
          }
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .el-card {
    padding: 20px;
  }
  </style>