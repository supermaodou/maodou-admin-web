<template>
    <div class="login-container">
        <div class="login-box">
            <div class="login-title">
                <h2>后台管理系统</h2>
                <p>Maodou Admin</p>
            </div>
            <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="top">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User"
                        size="large"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" prefix-icon="Lock"
                        size="large" @keyup.enter="handleLogin"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleLogin" size="large" style="width: 100%;">登 录</el-button>
                </el-form-item>
            </el-form>

            <!-- 测试账号提示 -->
            <div class="test-account">
                <p>测试账号：</p>
                <p>管理员账号：admin / 1</p>
                <p>普通用户账号：user / 1</p>
            </div>
        </div>
    </div>
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
                            permissions: [
                                'system:user:add',
                                'system:user:edit',
                                'system:user:delete',
                                'system:user:batchDelete',
                                'system:role:add',
                                'system:role:batchDelete',
                                'system:role:edit',
                                'system:role:permission',
                                'system:role:delete',
                                'system:menu:add',
                                'system:menu:edit',
                                'system:menu:delete',
                                'system:dict:add',
                                'system:dict:batchDelete',
                                'system:dict:data',
                                'system:dict:edit',
                                'system:dict:delete'
                            ],
                            roles: ['admin'],
                        };
                    }

                    // 普通用户账号
                    else if (this.loginForm.username === 'user' && this.loginForm.password === '1') {
                        userInfo = {
                            username: 'user',
                            nickname: '普通用户',
                            permissions: ['system:user:view'],
                            roles: ['user'],
                        };
                    }

                    // 账号或密码错误
                    else {
                        this.$message.error('用户名或密码错误');
                        return;
                    }

                    // 存储用户信息并跳转到首页
                    console.log('登录成功，用户信息：', userInfo);
                    this.$store.dispatch('login', userInfo); // 调用 Vuex Action 存储用户信息和权限
                    console.log('Vuex 状态：', this.$store.state);
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
.login-container {
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('/src/assets/login-bg.jpg') no-repeat center center;
    background-size: cover;
    position: relative;
}

.login-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(3px);
}

.login-box {
    position: relative;
    width: 400px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.login-title {
    text-align: center;
    margin-bottom: 30px;
}

.login-title h2 {
    font-size: 24px;
    color: #333;
    margin: 0;
    margin-bottom: 8px;
}

.login-title p {
    font-size: 16px;
    color: #666;
    margin: 0;
}

.el-form-item {
    margin-bottom: 25px;
}

.el-input {
    --el-input-hover-border: var(--el-color-primary);
}

.test-account {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px dashed #ddd;
    text-align: center;
    color: #666;
    font-size: 14px;
}

.test-account p {
    margin: 5px 0;
}

:deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}
</style>