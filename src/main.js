import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router'; // 导入路由配置
import ElementPlus from 'element-plus'; // 引入 Element Plus
import 'element-plus/dist/index.css'; // 引入 Element Plus 的样式文件

const app = createApp(App);

// 使用路由
app.use(router);
// 使用 Element Plus
app.use(ElementPlus);

app.mount('#app');