import { h, render } from 'preact';
import { App } from './App';

render(<App />, document.getElementById('app'));

// import App from './App.vue';
// import channels from '../store/channels';
// import router from './router';

// import Icon from 'vue-awesome/components/Icon.vue';
// import 'vue-awesome/icons/facebook';
// import 'vue-awesome/icons/instagram';
// import 'vue-awesome/icons/snapchat';
// import 'vue-awesome/icons/twitch';
// import 'vue-awesome/icons/twitter';
// import 'vue-awesome/icons/youtube';
//
// Vue.component('icon', Icon);

/* eslint no-new: "off" */
// new Vue({
//   router,
//   el: '#app',
//   data() {
//     return {
//       channels,
//     };
//   },
//   render: h => h(App),
// });
