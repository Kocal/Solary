<template>
  <div>
    <template v-if="loading">
      Chargement des paramètres...
    </template>
    <template v-else-if="success">
      <settings/>
    </template>
    <template v-else>
      {{ error.message }}
    </template>
  </div>
</template>

<script>
import Settings from './components/Settings';
import { settingsManager } from './services';

export default {
  components: { Settings },
  name: 'app',
  data() {
    return {
      loading: true,
      success: false,
      error: null,
    };
  },
  created() {
    settingsManager
      .hydrate()
      .then(() => {
        this.success = true;
        this.loading = false;
      })
      .catch(error => {
        this.error = error;
        this.loading = false;
      });
  },
};
</script>

<style>
body {
  width: 512px;
}
</style>
