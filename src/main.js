import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router'; // 导入路由配置
import store from './store'; // 引入 Vuex Store
import ElementPlus from 'element-plus'; // 引入 Element Plus
import 'element-plus/dist/index.css'; // 引入 Element Plus 的样式文件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 引入中文语言包
import directive from './directive'; // 引入directive
import "default-passive-events"; // 解决非被动事件监听警告，提升滚动性能
import * as api from '@/api'; // 导入 API 接口

const app = createApp(App);

// 初始化状态
const storedUserInfo = JSON.parse(localStorage.getItem('userInfo')) || null;
if (storedUserInfo) {
  store.commit('SET_USER_INFO', storedUserInfo); // 恢复用户信息
}

// 将 API 接口挂载到全局属性
app.config.globalProperties.$api = api;

// 使用路由
app.use(router);
// 使用 Element Plus 并设置 Element Plus 的默认语言
app.use(ElementPlus, {
    locale: zhCn,
});
// 使用 Vuex Store
app.use(store);
// 使用自定义指令
app.use(directive);
// 使用 Element Plus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app');