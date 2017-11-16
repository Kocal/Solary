<template>
  <s-image
      :url="url.replace('{width}', width).replace('{height}', height)"
      :width="width"
      :height="height"
  ></s-image>
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
  }
</script>