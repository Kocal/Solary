import { getSettingValue, getTwitchGame, loadSettings, pickTwitchApiKey } from '@kocal/web-extension-library';
import axios from 'axios';
import { TwitchApi } from '../../types';
import Channel from '../entities/Channel';
import Stream from '../entities/Stream';
import { updateBrowserAction } from './browser-action';
import { createNotificationForChannel } from './notifications';

const qs: any = require('qs');

let firstBoot = true;

class ChannelsManager {
  private autoRequestTwitchApiInterval: number | null;

  constructor(private channels: Array<Channel>) {
    this.autoRequestTwitchApiInterval = null;
  }

  public requestTwitchApi() {
    const url = 'https://api.twitch.tv/helix/streams';
    const config = {
      headers: {
        'Client-ID': pickTwitchApiKey(),
      },
      params: {
        user_id: this.channels.map(channel => channel.id),
      },
      paramsSerializer(params: object) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    };

    return axios
      .get(url, config)
      .then(response => response.data.data)
      .then(this.onSuccess.bind(this))
      .catch(error => {
        const message = "Une erreur s'est produite lors de la récupération de l'état des streams.";
        console.error(message, error);
      });
  }

  public enableAutoRequestTwitchApi() {
    this.autoRequestTwitchApiInterval = window.setInterval(() => {
      this.requestTwitchApi();
    }, 1.5 * 60 * 1000);
  }

  private async onSuccess(onlineChannels: Array<TwitchApi.Stream>) {
    const promises: Array<Promise<void>> = [];

    await loadSettings();

    this.channels.forEach(channel => {
      const onlineChannel: TwitchApi.Stream = onlineChannels.find(oc => +oc.user_id === channel.id) as TwitchApi.Stream;
      const isOnline: boolean = !!onlineChannel;

      if (isOnline) {
        const promise = getTwitchGame(onlineChannel.game_id)
          .then(game => {
            const wasOffline = !channel.online;
            const titleHasChanged = onlineChannel.title !== (channel.stream && channel.stream.title);

            channel.markAsOnline(
              new Stream(game.name, onlineChannel.title, onlineChannel.viewer_count, onlineChannel.thumbnail_url)
            );

            if (getSettingValue('showNotifications.atBoot') === false && firstBoot) {
              return;
            }

            if (getSettingValue('showNotifications.onTitleUpdate') === true && titleHasChanged) {
              return createNotificationForChannel(channel);
            }

            if (wasOffline) {
              createNotificationForChannel(channel);
            }
          })
          .catch(console.error);

        promises.push(promise);
      } else {
        channel.markAsOffline();
      }
    });

    return Promise.all(promises).then(() => {
      firstBoot = false;
      updateBrowserAction();
    });
  }
}

export { ChannelsManager };
