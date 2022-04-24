import Vue from 'vue'
import App from './App.vue'

//引入全局样式表
import './assets/css/global.css'
//引入element-ui
// import ElementUI from 'element-ui';

//按需引入
import {Form,FormItem,Input,Button,Container,Header,Aside,Main,Menu,Submenu,MenuItemGroup,
  MenuItem,Breadcrumb,BreadcrumbItem,Card,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,
  MessageBox,Tag,Tree,Select,Option} from 'element-ui'

//导入弹框提示组件需要在组件原型实例上挂载
import {Message} from 'element-ui'

//引入VueRouter
import VueRouter from 'vue-router'
//引入路由器
import router from './router'

//导入axios
import axios from 'axios'

//设置BaseUrL的=根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

//axios请求拦截器
axios.interceptors.request.use(config =>{
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //最后必须return config
  return config;
})
//将axios挂载到Vue原型上，让所有组件可以访问axios
Vue.prototype.$http = axios;

Vue.config.productionTip = false


//应用VueRouter插件
Vue.use(VueRouter)

//引用element-ui
// Vue.use(ElementUI)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)

Vue.prototype.$message = Message
//全局挂载MessageBOX
Vue.prototype.$confirm = MessageBox.confirm



new Vue({
  render: h => h(App),
  router
}).$mount('#app')
