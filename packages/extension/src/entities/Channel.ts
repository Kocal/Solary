import { Networks } from '../../types';
import Stream from './Stream';

export default class Channel {
  public online: boolean | null;
  public stream: Stream | null;

  constructor(public id: number, public username: string, public nickname: string, public networks: Networks) {
    this.online = null;
    this.stream = null;
  }

  url(): string {
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
