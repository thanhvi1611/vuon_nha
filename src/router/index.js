import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Calendar from '../views/Calendar.vue'
import AddPlant from '../views/AddPlant.vue'
import PlantDetail from '@/views/PlantDetail.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/calendar', component: Calendar },
  { path: '/add', component: AddPlant },
  { path: '/plant/:id', component: PlantDetail },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
