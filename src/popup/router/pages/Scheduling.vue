<template>
  <div>
    <a v-if="imageUrl" :href="pageUrl" target="_blank">
      <s-image :url="imageUrl"></s-image>
    </a>
    <p v-if="error">Une erreur s'est produite lors de la récupération de la programmation.</p>
  </div>
</template>

<script>
  import axios from 'axios';
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
      }
    },
    created() {
      axios.get(this.pageUrl)
        .then(response => response.data)
        .then(html => {
          console.log(html);
          const [_, imageUrl] = html.match(/<div class="prog-bg" style="background-image: url\('([^']+)'\);">/);

          this.imageUrl = `https://www.solary.fr/${imageUrl}`
        })
        .catch(error => {
          this.error = true;
          console.error(error);
        })
    }
  }
</script>

<style scoped>
  img {
    max-width: 100%;
    display: block;
  }
</style>