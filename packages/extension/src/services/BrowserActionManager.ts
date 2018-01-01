import Channel from '../entities/Channel';
import { setBadgeColor, setBadgeText, setTitle } from '../utils/ChromeBrowserAction';

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
    const solaryChannel: Channel | undefined = this.channels.find(channel => channel.username === 'solary');

    if (solaryChannel === undefined) {
      return;
    }

    if (solaryChannel.stream !== null) {
      markAsOnline();
      setTitle(`${solaryChannel.stream.title}\n\nJoue à ${solaryChannel.stream.game} devant ${solaryChannel.stream.viewers} viewers`);
    } else {
      markAsOffline();
      setTitle('Personne ne stream actuellement sur la TV !');
    }
  }
}

export {
  BrowserActionManager,
};
