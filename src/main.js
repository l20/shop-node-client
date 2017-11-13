import Vue from 'vue';
import App from './App';
import axios from 'axios';
import iView from 'iview';
import store from './store'
import {router} from './router';
import permission from './purview';
import IEcharts from 'vue-echarts-v3';
import VueLazyload from 'vue-lazyload';
import VueMarkdown from 'vue-markdown';
import VueSocketio from 'vue-socket.io';
import { currency } from './assets/js/utils';
import VueQuillEditor from 'vue-quill-editor';
import infiniteScroll from  'vue-infinite-scroll';
// styles
import 'iview/dist/styles/iview.css';
import './assets/css/base.css';
import './assets/css/product.css';
import './assets/css/checkout.css';
import 'stylus/index.styl';

// custom global variables
const URL = 'http://api.alphagoo.cn';
window.print = console.log;
Object.defineProperty(window, "API", {
  writable: false,
  enumerable: false,
  configurable: false,
  value: URL // 'http://localhost:5000'  current server url
});

// plugins apply
Vue.use(iView);
Vue.use(IEcharts);
Vue.use(VueLazyload);
Vue.use(VueMarkdown);
Vue.use(infiniteScroll);
Vue.use(permission, { app });
Vue.use(VueSocketio, URL); // server url
// Vue.use(VueSocketio, socketio('http://localhost:3001'), store);
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: './loading.jpg',
  loading: '../static/images/loading-svg/loading-cylon.svg',
  try: 3
});

Vue.config.productionTip = false;

// custom filter
Vue.filter("currency", currency);

// axios config
/**
 * 要发送cookie,设置 withCredentials = true; 的情况下
 * 也设置Access-Control-Allow-Credentials = true的同
 * 时Access-Control-Allow-Origin的值不能为“*”，必须
 * 设置一个完整的域，而且只允许一条，否则无法完成
 * 跨域而报错。
 */
Vue.prototype.$http = axios;
// axios.defaults.withCredentials = true;  // 要发送cookie此项必须设为true
// axios.defaults.baseURL = URL;

// http respones interceptors
axios.interceptors.response.use(function (response) {
  const res = response.data.data || response.data;
  // Requires authentication
  if (401 === res.status) {
    // router.push('*');
    alert(res.message)
  }
  // demo intercept
  if (10086 === res.status) {
    alert( res.message)
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});

// Vue options
const options = {
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
};

// Vue instance
export default  new Vue(options);
