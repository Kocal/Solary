import Channel from '../entities/Channel';
import { SettingsManager } from './SettingsManager';

const create = (title: string, message: string, id: string = '') => {
  chrome.notifications.create(id, {
    type: 'basic',
    iconUrl: '../icons/icon_128.png',
    title: title || '',
    message: message || '',
  });
};

class NotificationsManager {
  constructor(private channels: Array<Channel>, private settingsManager: SettingsManager) {
    chrome.notifications.onClicked.addListener(this.onNotificationClick.bind(this));
  }

  public show(channel: Channel): void {
    if (this.settingsManager.get('showNotifications') === false) {
      return;
    }

    if (!channel.stream) {
      return console.error(
        `Le channel ${channel.nickname} n'est pas en ligne, impossible d'afficher une notification.`
      );
    }

    create(`${channel.nickname} est en live sur ${channel.stream.game} !`, channel.stream.title, channel.username);
  }

  public showByTitleAndMessage(title: string, message: string): void {
    create(title, message);
  }

  private onNotificationClick(channelUsername: string): void {
    const channel = this.findByUsernameOrSolary(channelUsername);

    if (!channel) {
      return console.error(`Impossible de trouver le channel ${channelUsername}.`);
    }

    chrome.tabs.create({
      url: channel.url(),
      active: true,
    });
  }

  private findByUsernameOrSolary(username: String): Channel | undefined {
    return this.channels.find(c => c.username === username) || this.channels.find(c => c.username === 'solary');
  }
}

export { NotificationsManager };
