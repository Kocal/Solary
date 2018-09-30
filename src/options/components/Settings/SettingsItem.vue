<template>
  <h3 :class="[ size !== null ? `is-${size}` : '' ]">
    <label class="flex">
      <input v-if="setting.type === 'boolean'" v-model="value" :disabled="disabled" type="checkbox" class="checkbox">
      <span class="label">{{ setting.label }}</span>
      <setting-help v-if="setting.help" :help="setting.help"/>
    </label>
  </h3>
</template>

<script>
import { getSettingValue, setSettingValue } from '@kocal/web-extension-library';

import SettingHelp from './SettingHelp';

export default {
  components: { SettingHelp },
  name: 'SettingsItem',
  props: {
    name: {
      type: String,
      required: true,
    },
    setting: {
      type: Object,
      required: true,
    },
    size: {
      default: null,
    },
    disabled: {
      default: false,
    },
  },
  computed: {
    value: {
      get() {
        return getSettingValue(this.name);
      },
      set(value) {
        return setSettingValue(this.name, value);
      },
    },
  },
};
</script>

<style lang="scss">
.flex {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.label {
  padding-left: 0.25em;
}

.is-large {
  .label {
    font-size: 1.5em;
  }
}
</style>
