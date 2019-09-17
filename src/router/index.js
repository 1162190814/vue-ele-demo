import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Store from '@/components/store'
import Home from '@/components/home'
import logManages from '@/components/logManage/logManages'
import adminLogManage from '@/components/logManage/adminLogManage'
import userLogManage from '@/components/logManage/userLogManage'
import sysLogManage from '@/components/logManage/sysLogManage'

Vue.use(Router)

let routes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld,
    noMenu:true,
  },{
    path: '/home',
    name: 'home',
    component: Home,
  },{
    path: '/applyManage',
    name: 'applyManage',
    component: Home,
  },{
    path: '/logManages',
    name: 'logManages',
    component: logManages,
    children:[{
      path: '/userLogManage',
      name: 'userLogManage',
      component: userLogManage,
    },{
      path: '/sysLogManage',
      name: 'sysLogManage',
      component: sysLogManage,
    },{
      path: '/adminLogManage',
      name: 'adminLogManage',
      component: adminLogManage,
    }]
  }
]
const router = new Router({
  routes
})
export default router
