<template>
  <div>
    <settings-item :name="name" :setting="setting" size="large"/>
    <settings-item
      v-for="(childSetting, childName) in (setting.children || {})"
      :key="`${name}.${childName}`"
      :name="`${name}.${childName}`"
      :setting="childSetting"
      :disabled="!!setting.value === false"
    />
  </div>
</template>

<script>
import SettingsItem from './SettingsItem';

export default {
  components: { SettingsItem },
  name: 'SettingsSection',
  props: {
    name: {
      type: String,
      required: true,
    },
    setting: {
      type: Object,
      required: true,
    },
  },
};
</script>
