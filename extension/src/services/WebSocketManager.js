class WebSocketManager {
  constructor(config, notificationsManager) {
    this.config = config;
    this.notificationsManager = notificationsManager;
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

  onOpen() {
    console.info('WS: open');
  }

  onMessage(message) {
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

  onError(error) {
    console.error('WS: error', error);
    this.reconnect();
  }

  onClose() {
    console.info('WS: closed');
    this.reconnect();
  }
}

export default WebSocketManager;
