import Vue from 'vue';

import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/facebook';
import 'vue-awesome/icons/gear';
import 'vue-awesome/icons/instagram';
import 'vue-awesome/icons/snapchat';
import 'vue-awesome/icons/twitch';
import 'vue-awesome/icons/twitter';
import 'vue-awesome/icons/youtube';

import channels from '../store/channels';
import App from './App.vue';
import router from './router';

Vue.component('icon', Icon);

/* eslint no-new: "off" */
new Vue({
  router,
  el: '#app',
  data() {
    return {
      channels,
    };
  },
  render: (h) => h(App),
});
