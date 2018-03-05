import { WebSocketConfig } from '../../types';
import { NotificationsManager } from './NotificationsManager';

export default class WebSocketManager {
  private reconnecting: boolean;
  private websocket: WebSocket | null = null;

  constructor(public config: WebSocketConfig, public notificationsManager: NotificationsManager) {
    this.reconnecting = false;
  }

  connect() {
    this.reconnecting = false;
    this.websocket = new WebSocket(this.config.url);
    this.websocket.onopen = () => this.onOpen();
    this.websocket.onmessage = message => this.onMessage(message);
    this.websocket.onerror = error => this.onError(error);
    this.websocket.onclose = () => this.onClose();
  }

  reconnect(minutes = 20) {
    if (this.reconnecting) {
      console.warn('Reconnection has already been launched.');
      return;
    }

    console.info(`Reconnection in ${minutes} minutes...`);
    this.reconnecting = true;

    setTimeout(() => {
      this.connect();
    }, minutes * 60 * 1000);
  }

  private onOpen(): void {
    console.info('WS: open');
  }

  private onMessage(message: MessageEvent): void {
    console.info('WS: message', message);
    const parsedData = JSON.parse(message.data);
    const { type, data } = parsedData;

    switch (type) {
      case 'INFO':
        console.info(`WS:INFO: ${data.message}`);
        break;
      case 'NOTIFICATION':
        this.notificationsManager.showByTitleAndMessage(data.title, data.message);
        break;
      default:
        console.info(`WS: Unknown message type « ${type} » sent.`);
    }
  }

  private onError(error: Event): void {
    console.error('WS: error', error);
    this.reconnect();
  }

  private onClose(): void {
    console.info('WS: closed');
    this.reconnect();
  }
}
