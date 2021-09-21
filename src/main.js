import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import underscore from 'vue-underscore'
import faker from 'vue-faker'

Vue.config.productionTip = false

Vue.use(underscore)
Vue.use(faker)

Vue.filter('roundNumber', function (value, places) {
  if(!value) return ''
  let multiplier = Math.pow(10, places)
  return Math.trunc(multiplier * value) / multiplier
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
