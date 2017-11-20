<template>
  <div>
    <channel :channel="solaryChannel" size="big"></channel>
  </div>
</template>

<script>
  import Channel from '../../components/Channel.vue';

  export default {
    components: {
      Channel,
    },
    computed: {
      solaryChannel() {
        return this.$root.channels.find(channel => channel.nickname === 'Solary');
      },
    },
  };
</script>
