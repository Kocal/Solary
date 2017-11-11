<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
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

    height: calc(580px - 2 * #{$gutter});
    min-width: calc(780px - 2 * #{$gutter});

    margin: $gutter;
    padding: 2 * $gutter;

    font-size: 1.6rem;

    color: lighten(#222, 60%);
  }
</style>
