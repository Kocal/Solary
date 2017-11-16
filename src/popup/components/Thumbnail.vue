<template>
  <img
      :src="url.replace('{width}', width).replace('{height}', height)"
      :width="width"
      :height="height"
      :class="{loading}"
  >
</template>

<script>
  export default {
    props: {
      url: {
        type: String,
        required: true
      },
      width: {
        type: Number,
        'default': 225,
      },
      height: {
        type: Number,
        'default': 125
      }
    },
    data() {
      return {
        loading: true
      }
    }
  }
</script>

<style scoped lang="scss">
  img {
  }

  img.loading {
    animation-iteration-count: infinite;
    animation-name: fade;
    animation-duration: 1.5s;
    animation-timing-function: linear;
  }

  @keyframes fade {
    0%, 100% {
      background-color: rgba(#fff, .1);
    }

    50% {
      background-color: rgba(#fff, .3);
    }
  }
</style>