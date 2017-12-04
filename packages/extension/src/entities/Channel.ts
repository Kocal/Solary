import Stream from './Stream';
import { Networks } from '../../typings/Networks';

export default class Channel {
  public online: boolean | null;
  public stream: Stream | null;

  constructor(public id: number,
              public username: string,
              public nickname: string,
              public networks: Networks) {
    this.online = null;
    this.stream = null;
  }

  url(): string {
    // TODO: don't hardcode this, use buildUrl() method
    if (this.username === 'solary') {
      return 'https://www.solary.fr';
    }

    return `https://twitch.tv/${this.username}`;
  }

  markAsOnline(stream: Stream): void {
    this.online = true;
    this.stream = stream;
  }

  markAsOffline(): void {
    this.online = false;
    this.stream = null;
  }
}
