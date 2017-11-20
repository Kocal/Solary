class NotificationsManager {
  constructor(channels) {
    this.channels = channels;

    chrome.notifications.onClicked.addListener((channelUsername) => {
      const channel = this.channels.find(c => c.username === channelUsername);

      if (!channel) {
        return;
      }

      chrome.tabs.create({
        url: channel.url(),
        active: true,
      });
    });
  }

  /**
   * @param {Channel} channel
   */
  show(channel) {
    chrome.notifications.create(channel.username, {
      type: 'basic',
      iconUrl: '../icons/icon_128.png',
      title: `${channel.nickname} est en live sur ${channel.stream.game} !`,
      message: channel.stream.title || ' ',
    });
  }
}

export default NotificationsManager;
