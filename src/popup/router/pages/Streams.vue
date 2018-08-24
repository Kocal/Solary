<template>
  <div class="page-streams">
    <channel v-for="channel in $root.channels" :key="channel.id" :channel="channel"/>
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
