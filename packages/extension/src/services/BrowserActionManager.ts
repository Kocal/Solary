import Channel from '../entities/Channel';
import Stream from '../entities/Stream';

const setTitle = (title: string): void => chrome.browserAction.setTitle({ title });

const setBadgeText = (text: string): void => chrome.browserAction.setBadgeText({ text });

const setBadgeColor = (color: string): void => chrome.browserAction.setBadgeBackgroundColor({ color });

const markAsOnline = (): void => {
  setBadgeText('ON');
  setBadgeColor('green');
};

const markAsOffline = (): void => {
  setBadgeText('OFF');
  setBadgeColor('gray');
};

class BrowserActionManager {
  constructor(private channels: Array<Channel>) {
    setBadgeText('...');
  }

  public update(): void {
    if (this.channels.some(channel => channel.online as boolean)) {
      markAsOnline();
      this.buildTitle();
    } else {
      markAsOffline();
      setTitle('Personne ne stream actuellement sur la TV !');
    }
  }

  private buildTitle(): void {
    const title = this.channels
      .filter(channel => channel.online)
      .filter(channel => channel.stream !== null)
      .map(channel => {
        const stream = channel.stream as Stream;
        return `${channel.nickname} joue à ${stream.game} devant ${stream.viewers} viewers\n${stream.title}`;
      })
      .join('\n\n');

    setTitle(title);
  }
}

export { BrowserActionManager };
