<template>
  <div>
    <navigation></navigation>
    <keep-alive>
      <router-view class="router-view"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import Navigation from './components/Navigation.vue';
  import Channel from "../entities/Channel";

  export default {
    components: {
      Navigation
    },
    methods: {
      retrieveChannels() {
        chrome.runtime.sendMessage({type: 'GET_CHANNELS'}, response => {
          this.$root.channels = response.data.channels.map(channel => {
            channel.__proto__ = Channel.prototype;
            return channel;
          });
        });
      }
    },
    created() {
      this.retrieveChannels();
    }
  }
</script>

<style lang="scss">
  html {
    font-size: 62.5%;

    background: #1196ff;
    background: -moz-linear-gradient(45deg, #1196ff 0, #4940ff 25%, #d4886b 75%, #ffc919 100%);
    background: -webkit-linear-gradient(45deg, #1196ff 0, #4940ff 25%, #d4886b 75%, #ffc919 100%);
    background: linear-gradient(45deg, #1196ff 0, #4940ff 25%, #d4886b 75%, #ffc919 100%);
  }

  body {
    min-width: 800px;
    margin: 0;

    font-family: 'Gotham Book', sans-serif;
    font-size: 1.5rem;

    color: lighten(#222, 70%);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .router-view {
    margin: 4px;
  }
</style>
