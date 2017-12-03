import Channel from '../entities/Channel';

export default class NotificationsManager {
  constructor(private channels: Array<Channel>) {
    this.setupNotificationClickHandler();
  }

  public show(channel: Channel): void {
    if (!channel.stream) {
      return console.error(`Le channel ${channel.username} n'est pas en ligne, impossible d'afficher une notification.`);
    }

    chrome.notifications.create(channel.username, {
      type: 'basic',
      iconUrl: '../icons/icon_128.png',
      title: `${channel.nickname} est en live sur ${channel.stream.game} !`,
      message: channel.stream.title || ' ',
    });
  }

  public showByTitleAndMessage(title: string, message: string): void {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '../icons/icon_128.png',
      title: title || '',
      message: message || '',
    });
  }

  private setupNotificationClickHandler(): void {
    chrome.notifications.onClicked.addListener((channelUsername) => {
      const channel = this.findByUsernameOrSolary(channelUsername);

      if (!channel) {
        return console.error(`Impossible de trouver le channel ${channelUsername}.`);
      }

      chrome.tabs.create({
        url: channel.url(),
        active: true,
      });
    });
  }

  private findByUsernameOrSolary(username: String): Channel | undefined {
    return this.channels.find(c => c.username === username) || this.channels.find(c => c.username === 'solary');
  }
}
