import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Axios from 'axios';
import store from './store';
import { apiUrl } from '@/env.js'; 
import 'typeface-lato';
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';
window.hljs = hljs;
require('highlightjs-line-numbers.js');

Vue.prototype.$http = Axios.create({
  baseURL: apiUrl
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
