import Vue from 'vue'
import App from './App'
import BatchExport from './lib/index'

Vue.config.productionTip = false
Vue.use(BatchExport)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
