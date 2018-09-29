import { createNotification, createTab, onNotificationClick } from '@kocal/web-extension-library';
import Channel from '../entities/Channel';
import channels from '../store/channels';
import { SettingsManager } from './SettingsManager';

onNotificationClick((notificationId: string) => {
  const channel = channels.find(channel => channel.username === notificationId);

  if (!channel) {
    return console.error(`Impossible de trouver le channel ${notificationId}.`);
  }

  createTab({
    url: channel.url(),
  });
});

const create = (title: string, message: string, id: string = '') => {
  createNotification(id, {
    type: 'basic',
    iconUrl: '../icons/icon_128.png',
    title: title || '',
    message: message || '',
  });
};

class NotificationsManager {
  constructor(private settingsManager: SettingsManager) {}

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
}

export { NotificationsManager };
