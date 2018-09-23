<template>
  <div class="page-scheduling">
    <a v-if="imageUrl" :href="pageUrl" target="_blank" data-testid="scheduling-url">
      <s-image :url="imageUrl" data-testid="scheduling-image"/>
    </a>
    <p v-if="error" class="alert alert-error">{{ error }}</p>
  </div>
</template>

<script>
import Image from '../../components/Image.vue';
import { getScheduling } from '../../../services/scheduling';

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
    getScheduling()
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
