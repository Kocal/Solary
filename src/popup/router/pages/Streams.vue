<template>
  <div>
    <channel :channel="solaryChannel" size="big"></channel>
    <div class="grid">
      <template v-for="channel in allChannelsExceptSolary">
        <channel :channel="channel"></channel>
      </template>
    </div>
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
      allChannelsExceptSolary() {
        return this.$root.channels.filter(channel => channel.nickname !== 'Solary');
      }
    },
  }
</script>

<style scoped>
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1px;
    margin-top: 1px;
  }
</style>