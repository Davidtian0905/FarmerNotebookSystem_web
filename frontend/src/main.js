import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// 引入Vant样式
import 'vant/lib/index.css'
// 引入全局样式
import './styles/index.scss'

// 初始化Mock系统
import { initializeMockSystem } from './mock/index.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 初始化Mock系统
initializeMockSystem().catch(console.error)

app.mount('#app')
