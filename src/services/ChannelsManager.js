import axios from 'axios';

const qs = require('qs');

class ChannelsManager {
  constructor(channels, clientIdsManager, gamesManager, notificationsManager) {
    this.channels = channels;
    this.clientIdsManager = clientIdsManager;
    this.gamesManager = gamesManager;
    this.notificationsManager = notificationsManager;
    this._autoRequestTwitchApiInterval = null;
  }

  requestTwitchApi() {
    const url = 'https://api.twitch.tv/helix/streams';
    const config = {
      headers: {
        'Client-ID': this.clientIdsManager.pickOne()
      },
      params: {
        user_id: this.channels.map(channel => channel.id)
      },
      paramsSerializer(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      }
    };

    axios.get(url, config)
      .then(response => response.data.data)
      .then(this.onSuccess.bind(this))
      .catch(this.onError.bind(this))
  }

  enableAutoRequestTwitchApi() {
    this._autoRequestTwitchApiInterval = setInterval(() => {
      this.requestTwitchApi()
    }, 1.5 * 60 * 1000);
  }

  onSuccess(onlineChannels) {
    this.channels.forEach(channel => {
      const onlineChannel = onlineChannels.find(onlineChannel => +onlineChannel.user_id === channel.id);
      const isOnline = !!onlineChannel;

      if (isOnline) {
        this.gamesManager.getNameById(onlineChannel['game_id'])
          .then(game => {
            const wasOffline = !channel.online;
            const oldTitle = (channel.stream || {}).title;

            channel.markAsOnline({
              game,
              title: onlineChannel.title,
              viewers: onlineChannel.viewer_count,
              thumbnail_url: onlineChannel.thumbnail_url,
            });

            if (wasOffline || oldTitle !== channel.stream.title) {
              this.notificationsManager.show(channel);
            }
          })
          .catch(console.error)
      } else {
        channel.markAsOffline();
      }
    });
  }

  onError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.warn(error.response.data);
      console.warn(error.response.status);
      console.warn(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.warn('Error during request', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.warn('Error', error.message);
    }
  }
}

export default ChannelsManager