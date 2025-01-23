<template>
    <el-container style="height: 100vh; display: flex; align-items: center; justify-content: center;">
        <el-card style="width: 400px;">
            <h2 style="text-align: center;">登录</h2>
            <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleLogin" style="width: 100%;">登录</el-button>
                </el-form-item>
            </el-form>

            <!-- 测试账号提示 -->
            <div style="text-align: center; margin-top: 20px;">
                <p>测试账号：</p>
                <p>1. 管理员账号：admin / 1</p>
                <p>2. 普通用户账号：user / 1</p>
            </div>
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
        handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    // 模拟登录成功
                    let userInfo = null;

                    // 管理员账号
                    if (this.loginForm.username === 'admin' && this.loginForm.password === '1') {
                        userInfo = {
                            username: 'admin',
                            nickname: '管理员',
                            permissions: ['system:user:add', 'system:user:edit', 'system:user:delete', 'system:user:batchDelete'], // 管理员权限
                            roles: ['admin'], // 管理员角色
                        };
                    }
                    
                    // 普通用户账号
                    else if (this.loginForm.username === 'user' && this.loginForm.password === '1') {
                        userInfo = {
                            username: 'user',
                            nickname: '普通用户',
                            permissions: ['system:user:view'], // 普通用户权限
                            roles: ['user'], // 普通用户角色
                        };
                    }

                    // 账号或密码错误
                    else {
                        this.$message.error('用户名或密码错误');
                        return;
                    }

                    // 存储用户信息并跳转到首页
                    console.log('登录成功，用户信息：', userInfo); // 调试信息
                    this.$store.dispatch('login', userInfo); // 调用 Vuex Action 存储用户信息和权限
                    console.log('Vuex 状态：', this.$store.state); // 调试信息
                    this.$router.push('/dashboard'); // 跳转到首页
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