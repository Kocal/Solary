<template>
  <a :href="channel.url()" :data-testid="`stream-${channel.username}`" class="channel" :class="[{offline: !channel.online}]" target="_blank">
    <div v-if="channel.online" class="grid">
      <div class="grid__aside">
        <thumbnail :url="channel.stream.thumbnail_url" :width="300" :height="166" style="display: block">
          <icon-play class="thumbnail__play-button"/>
        </thumbnail>
      </div>
      <div class="grid__main">
        <h2 class="channel__nickname">
          <a :href="channel.url()" target="_blank">{{ channel.nickname }}</a>
        </h2>
        <p class="channel__stream-title">{{ channel.stream.title }}</p>
        <span class="channel__stream-status">
            Joue à
            <a :href="'https://www.twitch.tv/directory/game/' + encodeURIComponent(channel.stream.game)" target="_blank" data-testid="stream-game">{{ channel.stream.game }}</a>
            devant <em data-testid="stream-viewers">{{ channel.stream.viewers }}</em> viewers
          </span>
      </div>
    </div>
    <template v-else>
      <h2 class="channel__nickname">{{ channel.nickname }}</h2>
      <span class="channel__state--offline">Actuellement hors-ligne</span>
    </template>
  </a>
</template>

<script>
import IconPlay from './IconPlay.vue';
import Thumbnail from './Thumbnail.vue';

export default {
  components: {
    IconPlay,
    Thumbnail,
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.channel {
  display: block;
  padding: 8px;

  background-color: #1b1c1d;
  box-shadow: 0 0 1px #000;

  transition: background-color 0.1s linear;

  &.offline {
    filter: grayscale(1);
  }

  & + & {
    margin-top: 4px;
  }
}

.channel__nickname {
  margin: 0.25em 0;
  font-size: 3.2rem;
  font-weight: 400;
  color: #ffcc00;
}

.channel__stream-title {
  margin: 0.5em 0;
}

.channel__stream-status {
  text-transform: uppercase;
  font-weight: bold;
  font-size: 1.4rem;

  > a {
    color: #ffcc00;
    transition: color 0.1s linear;

    &:hover {
      color: #7d5bbe;
    }
  }
}

.channel__state--offline {
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

.grid {
  display: flex;
}

.grid__main {
  flex: 1;
  padding: 0 8px 8px;
}
</style>
