<template>
  <div>
    <settings-section v-for="(setting, name) in settings" :key="name" :name="name" :setting="setting" />
  </div>
</template>

<script>
import SettingsSection from './Settings/SettingsSection';

export default {
  name: 'Settings',
  components: { SettingsSection },
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
};
</script>
