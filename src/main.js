import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import underscore from "vue-underscore";
import faker from "vue-faker";
import "vue-easytable/libs/theme-default/index.css";
import VueEasytable from "vue-easytable";
import VueCoreVideoPlayer from "vue-core-video-player";

Vue.config.productionTip = false;

Vue.use(underscore);
Vue.use(faker);
Vue.use(VueEasytable);
Vue.use(VueCoreVideoPlayer);

Vue.filter("roundNumber", function(value, places) {
  if (!value) return "";
  let multiplier = Math.pow(10, places);
  return Math.trunc(multiplier * value) / multiplier;
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
