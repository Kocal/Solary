<template>
  <div>
    <a v-if="imageUrl" :href="pageUrl" target="_blank">
      <s-image :url="imageUrl"></s-image>
    </a>
    <p v-if="error" class="alert alert-error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import { SchedulingManager } from '../../../services/SchedulingManager';
import Image from '../../components/Image.vue';

export default {
  components: {
    's-image': Image,
  },
  data() {
    return {
      pageUrl: 'https://www.solary.fr/programme/',
      imageUrl: null,
      error: null,
    };
  },
  created() {
    const schedulingManager = new SchedulingManager();

    schedulingManager
      .getScheduling()
      .then(imageUrl => (this.imageUrl = imageUrl))
      .catch(error => (this.error = error));
  },
};
</script>

<style scoped>
img {
  max-width: 100%;
  display: block;
}
</style>
