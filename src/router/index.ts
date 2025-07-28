import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import XmlUnificadorPage from '@/pages/XmlUnificadorPage.vue'
import VehicleManagerPage from '@/pages/VehicleManagerPage.vue'
import HelpPage from '@/pages/HelpPage.vue'

// 定义路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/unificador',
    name: 'unificador',
    component: XmlUnificadorPage
  },
  {
    path: '/vehicle-manager',
    name: 'vehicle-manager',
    component: VehicleManagerPage
  },
  {
    path: '/ajuda',
    name: 'ajuda',
    component: HelpPage
  },
  {
    path: '/about',
    name: 'about',
    component: {
      template: '<div class="text-center text-xl p-8">About Page - Coming Soon</div>',
    },
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
