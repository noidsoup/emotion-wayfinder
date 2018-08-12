// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css';
 
Vue.use(Vuetify)

// sets up a global variable, used in calling to our server throughout the app.
// Vue.prototype.$serverAddress = window.location.origin;

//for development
Vue.prototype.$serverAddress = `http://${window.location.hostname}:3000`;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
