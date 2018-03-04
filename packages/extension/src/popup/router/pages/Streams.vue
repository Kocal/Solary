<template>
  <div>
    <channel v-for="channel in $root.channels" :channel="channel"/>
  </div>
</template>

<script>
import Channel from '../../components/Channel.vue';

export default {
  components: {
    Channel,
  },
};
</script>
