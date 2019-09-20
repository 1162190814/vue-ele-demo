import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Store from '@/components/store'
import Home from '@/components/home'
import tran from '@/components/transferTest'
import logManages from '@/components/logManage/logManages'
import adminLogManage from '@/components/logManage/adminLogManage'
import userLogManage from '@/components/logManage/userLogManage'
import sysLogManage from '@/components/logManage/sysLogManage'
import transDialog from  '@/components/transDialog'

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
    meta: { title: '首页', icon: '' },
    component: Home,
  },{
    path: '/applyManage',
    name: 'applyManage',
    component: Home,
  },{
    path: '/logManages',
    name: 'logManages',
    meta: { title: '日志管理', icon: '' },
    component: logManages,
    children:[{
      path: '/userLogManage',
      name: 'userLogManage',
      meta: { title: '用户日志管理', icon: '' },
      component: userLogManage,
    },{
      path: '/sysLogManage',
      name: 'sysLogManage',
      meta: { title: '系统日志管理', icon: '' },
      component: sysLogManage,
    },{
      path: '/adminLogManage',
      name: 'adminLogManage',
      meta: { title: '管理员日志管理', icon: '' },
      component: adminLogManage,
    }]
  },{
    path: '/tran',
    name: 'tran',
    component: tran,
  },{
    path: '/transDialog',
    name: 'transDialog',
    component: transDialog,
  },

]
const router = new Router({
  routes
})
export default router
