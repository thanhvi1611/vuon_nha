import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Calendar from '../views/Calendar.vue'
import AddPlant from '../views/AddPlant.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/calendar', component: Calendar },
  { path: '/add', component: AddPlant },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
