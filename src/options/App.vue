<template>
  <div>
    <template v-if="loading">
      Chargement des paramètres...
    </template>
    <template v-else-if="error">
      {{ error.message }}
    </template>
    <template>
      <settings :settings="settings"/>
    </template>
  </div>
</template>

<script>
import { registerSettings, getSettings } from '@kocal/web-extension-library';
import settings from '../store/settings';
import Settings from './components/Settings';

export default {
  components: { Settings },
  name: 'app',
  data() {
    return {
      settings: {},
      loading: true,
      error: null,
    };
  },
  created() {
    registerSettings(settings)
      .then(() => {
        this.loading = false;
        this.$set(this, 'settings', getSettings());
      })
      .catch(error => {
        this.loading = false;
        this.error = error;
      });
  },
};
</script>

<style>
body {
  width: 512px;
}
</style>
