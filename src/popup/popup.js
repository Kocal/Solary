import Vue from 'vue';
import App from './App.vue';
import router from './router';

import channels from '../store/channels';

new Vue({
  el: '#app',
  router,
  data() {
    return {
      channels,
    };
  },
  render: h => h(App),
});
