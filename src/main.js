import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

// 1.导入axios
import axios from "axios";
import {Loading} from "element-ui";

// 2.设置请求的根路径
axios.defaults.baseURL = 'http://49.232.199.15:8000/api/private/v1/'

let loadingInstance = null

// 配置请求拦截器
axios.interceptors.request.use(config => {
    // 调用 Loading 组件的 service() 方法,创建 Loading 组件的实例，并全屏展示 loading 效果
    loadingInstance = Loading.service({fullscreen: true})
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

// 配置响应拦截器
axios.interceptors.response.use(response => {
    loadingInstance.close()
    return response
})
// 3.把包挂载到vue的原型对象上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
