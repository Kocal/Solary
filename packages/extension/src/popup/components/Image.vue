<template>
  <img
      :src="url"
      :class="{loading}"
      @load="loading = false"
  >
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
    };
  },
};
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
  0%,
  100% {
    background-color: rgba(#fff, 0.1);
  }

  50% {
    background-color: rgba(#fff, 0.3);
  }
}
</style>
