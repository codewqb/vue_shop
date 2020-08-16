import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('views/login/Login')
const Home = () => import('views/home/Home')
const Welcome = () => import('views/home/Welcome')
const Users = () => import('views/home/userm/Users')
const Rights = () => import('views/home/rightm/Rights')
const Roles = () => import('views/home/rightm/Roles')
const Goods = () => import('views/home/goodsm/Goods')
const Add = () => import('views/home/goodsm/Add')
const Params = () => import('views/home/goodsm/Params')
const Categories = () => import('views/home/goodsm/Categories')
const Orders = () => import('views/home/orderm/Orders')
const Reports = () => import('views/home/statistics/Reports')
Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: 'welcome',
    children: [{
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/goods',
        component: Goods
      },

      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/reports',
        component: Reports
      }
    ]

  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
// 导航守卫控制页面访问权限，如果用户没有登录直接通过url
// 访问特定页面，则需要重新登录
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  } else {
    // 从settionStorage中获取保存的token值
    const strToken = window.sessionStorage.getItem('token');
    // 没有token 则跳转到登录页
    return !strToken ? next('/login') : next();
  }
})
export default router
