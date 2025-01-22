import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router'; // 导入路由配置
import ElementPlus from 'element-plus'; // 引入 Element Plus
import 'element-plus/dist/index.css'; // 引入 Element Plus 的样式文件
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 引入中文语言包
import store from './store'; // 引入 Vuex Store

const app = createApp(App);

// 使用路由
app.use(router);
// 使用 Element Plus 并设置 Element Plus 的默认语言
app.use(ElementPlus, {
    locale: zhCn,
})
// 使用 Vuex Store
app.use(store);

app.mount('#app');