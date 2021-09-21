import Vue from 'vue'
import VueRouter from 'vue-router'
import Base from '../views/Base.vue'
import QualtricsConverter from '../components/QualtricsConverter.vue'
import KBFOptimizer from '../components/KBFOptimizer.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Base,
    children: [
      { path: '', component: KBFOptimizer },
      { path: 'qualtrics', component: QualtricsConverter }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
