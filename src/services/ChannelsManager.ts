import axios from 'axios';
import { TwitchApi } from '../../types';
import Channel from '../entities/Channel';
import Stream from '../entities/Stream';
import { BrowserActionManager } from './BrowserActionManager';
import { ClientIdsManager } from './ClientIdsManager';
import { GamesManager } from './GamesManager';
import { NotificationsManager } from './NotificationsManager';
import { SettingsManager } from './SettingsManager';

const qs: any = require('qs');

let firstBoot = true;

class ChannelsManager {
  private autoRequestTwitchApiInterval: number | null;

  constructor(
    private channels: Array<Channel>,
    private clientIdsManager: ClientIdsManager,
    private gamesManager: GamesManager,
    private notificationsManager: NotificationsManager,
    private browserActionManager: BrowserActionManager,
    private settingsManager: SettingsManager
  ) {
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

  private onSuccess(onlineChannels: Array<TwitchApi.Stream>) {
    const promises: Array<Promise<void>> = [];

    this.channels.forEach(channel => {
      const onlineChannel: TwitchApi.Stream = onlineChannels.find(oc => +oc.user_id === channel.id) as TwitchApi.Stream;
      const isOnline: boolean = !!onlineChannel;

      if (isOnline) {
        const promise = this.gamesManager
          .getNameById(onlineChannel.game_id)
          .then(game => {
            const wasOffline = !channel.online;
            const titleHasChanged = onlineChannel.title !== (channel.stream && channel.stream.title);

            channel.markAsOnline(
              new Stream(game, onlineChannel.title, onlineChannel.viewer_count, onlineChannel.thumbnail_url)
            );

            if (this.settingsManager.get('showNotifications.atBoot') === false && firstBoot) {
              return;
            }

            if (this.settingsManager.get('showNotifications.onTitleUpdate') === true && titleHasChanged) {
              return this.notificationsManager.show(channel);
            }

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

    return Promise.all(promises).then(() => {
      firstBoot = false;
      this.browserActionManager.update();
    });
  }
}

export { ChannelsManager };
