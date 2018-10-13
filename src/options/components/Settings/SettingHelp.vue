<template>
  <span class="help">
    <span class="help__activator">
      <span>?</span>
    </span>
    <span class="help__popup" v-text="help"/>
  </span>
</template>

<script>
export default {
  name: 'SettingHelp',
  props: {
    help: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
$size: 16px;
$activator-color: #555;

.help {
  margin: 0 4px;
  position: relative;
}

.help__activator {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  height: $size;
  width: $size;

  background-color: $activator-color;
  color: lighten($activator-color, 65%);
  text-shadow: 1px 1px rgba(darken($activator-color, 50%), 0.5);
  border-radius: 50%;
  font-weight: bold;
}

.help__popup {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 16em;
  padding: 8px;

  border-radius: 4px;
  background-color: rgba(#000, 0.9);
  color: lighten(#000, 90%);
  opacity: 0;
  text-align: center;

  transform: translate3d(-50%, 0, 0);
  transition: all 0.2s ease-in-out;
  pointer-events: none;
}

.help:hover .help__popup {
  bottom: $size + 4px;
  opacity: 1;
}
</style>
