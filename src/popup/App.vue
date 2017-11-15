<template>
  <div>
    <navigation></navigation>
    <router-view></router-view>
  </div>
</template>

<script>
  import Navigation from './components/Navigation.vue';

  export default {
    components: {
      Navigation
    },
    methods: {
      retrieveChannels() {
        chrome.runtime.sendMessage({type: 'GET_CHANNELS'}, response => {
          this.$root.channels = response.data.channels;
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
    $gutter: 4px;

    height: calc(580px - #{$gutter});
    min-width: 780px;

    margin: $gutter;

    font-size: 1.6rem;

    color: lighten(#222, 70%);
  }
</style>
