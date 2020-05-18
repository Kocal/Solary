<template>
  <div class="thumbnail">
    <s-image
      :url="url.replace('{width}', width).replace('{height}', height)"
      :width="width"
      :height="height"
      class="thumbnail__image"
    />
    <slot />
  </div>
</template>

<script>
import Image from './Image.vue';

export default {
  components: {
    's-image': Image,
  },
  props: {
    url: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 405,
    },
    height: {
      type: Number,
      default: 225,
    },
  },
};
</script>

<style scoped lang="scss">
.thumbnail {
  position: relative;
}

.thumbnail__image {
  opacity: 0.5;
}

.thumbnail__play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3D(-50%, -50%, 0);
}
</style>
