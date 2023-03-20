import { createApp } from 'vue'
import App from './App.vue'
import store from "@/store";
import router from "@/router";
import ElementPlus from "element-plus";
import 'element-plus/dist/index.css'
import axios from "axios";
axios.interceptors.request.use(config=>{
    config.headers['token']=sessionStorage.getItem('token');
    return config;
})

createApp(App).use(store).use(router).use(ElementPlus).mount('#app')


























