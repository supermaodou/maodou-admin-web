import axios from 'axios'
import { ElMessage } from 'element-plus'
import store from '@/store'
import router from '@/router'

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // API 基础路径
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从 store 中获取 token
    const token = store.state.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 这里假设后端返回格式为 { code: 200, data: {}, message: 'success' }
    if (res.code === 200) {
      return res.data
    } else {
      ElMessage.error(res.message || '请求失败')
      // 处理特定错误码
      if (res.code === 401) {
        // token 过期或未登录
        store.dispatch('logout')
        router.push('/login')
      }
      return Promise.reject(res)
    }
  },
  error => {
    console.error('响应错误：', error)
    ElMessage.error(error.message || '网络请求失败')
    return Promise.reject(error)
  }
)

export default service