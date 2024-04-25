import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import ElementPlus from 'element-plus' //全局引入
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/style/base.scss'
import * as ElIcons from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import Echarts from "vue-echarts"
import * as echarts from 'echarts';

const app = createApp(App)
const pinia = createPinia()

for (const name in ElIcons){
	app.component(name,(ElIcons as any)[name])
}

app.use(ElementPlus, {locale: zhCn})
app.use(router)
app.use(pinia)
app.mount('#app')

app.component("v-chart", Echarts)
 
app.config.globalProperties.$echarts = echarts
