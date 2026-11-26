import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/reset.css'
import './assets/styles/tokens.css'

// 保险：启动时回到页面顶部，避免浏览器恢复上次滚动位置
window.scrollTo(0, 0)

createApp(App).mount('#app')
