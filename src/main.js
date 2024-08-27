import Vue from 'vue'
import App from './App.vue'
import VueClipboard from  'vue-clipboard2';
import './lib/element.js'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'
import '@/assets/style/index.css'
Vue.config.productionTip = false

Vue.use(VueClipboard)
new Vue({
  render: h => h(App),
}).$mount('#app')
