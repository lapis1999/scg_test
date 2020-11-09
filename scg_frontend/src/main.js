import Vue from 'vue'
import App from './App.vue'
import * as VueGoogleMap from 'vue2-google-maps'
import VueApexCharts from 'vue-apexcharts'
import x5GMaps from 'x5-gmaps'
Vue.use(x5GMaps, { key: 'AIzaSyCUt4c1CFKRZYRd1Pyjy4n6XCAV3Q61LuE', libraries: ['places', 'visualization'] })
Vue.use(VueApexCharts)
Vue.config.productionTip = false
Vue.use(VueGoogleMap, {
  load: {
    key: 'AIzaSyCUt4c1CFKRZYRd1Pyjy4n6XCAV3Q61LuE'
  }
})
Vue.component('apexchart', VueApexCharts)

new Vue({
  render: h => h(App),
}).$mount('#app')



