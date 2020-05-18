import {
  createNotification as _createNotification,
  createTab,
  getSettingValue,
  onNotificationClick,
} from '@kocal/web-extension-library';
import Channel from '../entities/Channel';
import channels from '../store/channels';

onNotificationClick((notificationId: string) => {
  const channel = channels.find((channel) => channel.username === notificationId);

  if (!channel) {
    return console.error(`Impossible de trouver le channel ${notificationId}.`);
  }

  createTab({
    url: channel.url(),
  });
});

export const createNotification = (title: string, message: string, id: string = ''): void => {
  if (getSettingValue('showNotifications') === false) {
    return;
  }

  _createNotification(id, {
    type: 'basic',
    iconUrl: '../icons/icon_128.png',
    title: title || '',
    message: message || '',
  });
};

export const createNotificationForChannel = (channel: Channel) => {
  if (channel.stream) {
    createNotification(
      `${channel.nickname} est en live sur ${channel.stream.game} !`,
      channel.stream.title,
      channel.username
    );
  }
};
