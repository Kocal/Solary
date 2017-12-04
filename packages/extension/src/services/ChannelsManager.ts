import axios from 'axios';
import Channel from '../entities/Channel';
import ClientIdsManager from './ClientIdsManager';
import GamesManager from './GamesManager';
import NotificationsManager from './NotificationsManager';
import BrowserActionManager from './BrowserActionManager';
import Stream from '../entities/Stream';
import { TwitchApi } from '../../typings/TwitchApi';

const qs: any = require('qs');

export default class ChannelsManager {
  private autoRequestTwitchApiInterval: number | null;

  constructor(private channels: Array<Channel>,
              private clientIdsManager: ClientIdsManager,
              private gamesManager: GamesManager,
              private notificationsManager: NotificationsManager,
              private browserActionManager: BrowserActionManager) {
    this.autoRequestTwitchApiInterval = null;
  }

  public requestTwitchApi() {
    const url = 'https://api.twitch.tv/helix/streams';
    const config = {
      headers: {
        'Client-ID': this.clientIdsManager.pickOne(),
      },
      params: {
        user_id: this.channels.map(channel => channel.id),
      },
      paramsSerializer(params: object) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    };

    axios.get(url, config)
      .then(response => response.data.data)
      .then(this.onSuccess.bind(this))
      .catch(this.onError.bind(this));
  }

  public enableAutoRequestTwitchApi() {
    this.autoRequestTwitchApiInterval = window.setInterval(() => {
      this.requestTwitchApi();
    }, 1.5 * 60 * 1000);
  }

  private onSuccess(onlineChannels: Array<TwitchApi.Stream>) {
    const promises: Array<Promise<void>> = [];

    this.channels.forEach((channel) => {
      const onlineChannel: TwitchApi.Stream | undefined = onlineChannels.find(oc => +oc.user_id === channel.id);
      const isOnline: boolean = !!onlineChannel;

      if (onlineChannel === undefined) {
        return console.error(`Impossible de trouver le channel n°${channel.id}.`);
      }

      if (isOnline) {
        const promise = this.gamesManager.getNameById(onlineChannel.game_id)
          .then((game) => {
            const wasOffline = !channel.online;

            channel.markAsOnline(new Stream(game, onlineChannel.title, onlineChannel.viewer_count, onlineChannel.thumbnail_url));

            if (wasOffline) {
              this.notificationsManager.show(channel);
            }
          })
          .catch(console.error);

        promises.push(promise);
      } else {
        channel.markAsOffline();
      }
    });

    Promise.all(promises).then(() => {
      this.browserActionManager.update();
    });
  }

  private onError(error: any) {
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
