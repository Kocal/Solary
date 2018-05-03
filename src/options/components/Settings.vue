<template>
  <div>
    <settings-section
      v-for="(setting, name) in settings"
      :key="name"
      :name="name"
      :setting="setting"
    />
  </div>
</template>

<script>
import { settingsManager } from '../services';
import SettingsSection from './Settings/SettingsSection';

export default {
  name: 'Settings',
  components: { SettingsSection },
  data() {
    return {
      settings: settingsManager.getSettings(),
    };
  },
};
</script>
