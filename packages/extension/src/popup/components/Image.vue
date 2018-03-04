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
img.loading {
  animation-iteration-count: infinite;
  animation-name: fade;
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
}

@keyframes fade {
  0%,
  100% {
    background-color: rgba(#fff, 0.1);
  }

  50% {
    background-color: rgba(#fff, 0.2);
  }
}
</style>
