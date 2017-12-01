class BrowserActionManager {
  constructor(channels) {
    this.channels = channels;

    this.setBadgeText('...');
  }

  update() {
    const solaryChannel = this.channels.find(channel => channel.username === 'solary');

    if (solaryChannel.online) {
      this.markAsOnline();
      this.setTitle(`${solaryChannel.stream.title}\n\nJoue à ${solaryChannel.stream.game} devant ${solaryChannel.stream.viewers} viewers`);
    } else {
      this.markAsOffline();
      this.setTitle('Personne ne stream actuellement sur la TV !');
    }
  }

  markAsOnline() {
    this.setBadgeText('ON');
    this.setBadgeColor('green');
  }

  markAsOffline() {
    this.setBadgeText('OFF');
    this.setBadgeColor('gray');
  }

  setTitle(title) {
    chrome.browserAction.setTitle({
      title,
    });
  }

  setBadgeText(text) {
    chrome.browserAction.setBadgeText({
      text,
    });
  }

  setBadgeColor(color) {
    chrome.browserAction.setBadgeBackgroundColor({
      color,
    });
  }
}

export default BrowserActionManager;
