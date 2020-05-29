import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import vueAxios from 'vue-axios';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';


import App from './App.vue';
import router from './router';
import EventBus from "@/plugins/EventBus";
Vue.config.productionTip = false;
axios.defaults.withCredentials = true;

Vue.use(VueRouter);
Vue.use(Antd);
Vue.use(EventBus);
Vue.use(vueAxios,axios);

// 响应拦截
axios.interceptors.response.use((response) => {
  return response;
  }, (error) => {
    // 如果没有登录，重定向到登录页面
    if (error.response.status == 401) {
      return window.location.href = `http://smart.ztzl.com/smart-passport/?callbackUrl=${encodeURIComponent(window.location.href)}`;
    }else{
      return Promise.reject(error);
    }
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')


