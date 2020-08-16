import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'assets/fa/css/all.css'
import TreeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.filter('dateFormat', value => {
  function db(data) {
    if (data < 10) {
      return '0' + data;
    }else{
      return data;
    }
  }
  const dt = new Date(value);
  const y = dt.getFullYear();
  const m = db(dt.getMonth()+1);
  const d = db(dt.getDate());
  const hh = db(dt.getHours());
  const mm = db(dt.getMinutes());
  const ss = db(dt.getSeconds());
  return y+'-'+m+'-'+d+' '+hh+':'+mm+':'+ss;
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
