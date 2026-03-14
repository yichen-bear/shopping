import { createRouter, createWebHistory } from 'vue-router'
import Products from '../views/Products.vue'
import Cart from '../views/Cart.vue'
import Login from '../views/Login.vue'
import Checkout from '../views/Checkout.vue'
import ProductDetail from '../views/ProductDetail.vue'

const routes = [
  { path: '/', name: 'Home', component: Products },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/login', name: 'Login', component: Login },
  { path: '/checkout', name: 'Checkout', component: Checkout },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetail },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router