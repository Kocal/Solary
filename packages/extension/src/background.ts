import webSocketConfig from './config/webSocket';
import { BrowserActionManager } from './services/BrowserActionManager';
import { ChannelsManager } from './services/ChannelsManager';
import { ClientIdsManager } from './services/ClientIdsManager';
import { GamesManager } from './services/GamesManager';
import { LocalStorageManager } from './services/LocalStorageManager';
import { NotificationsManager } from './services/NotificationsManager';
import { SchedulingManager } from './services/SchedulingManager';
import { SettingsManager } from './services/SettingsManager';
import { StorageManager } from './services/StorageManager';
import WebSocketManager from './services/WebSocketManager';
import channels from './store/channels';
import clientIds from './store/clientIds';
import settings from './store/settings';

const storageManager = new StorageManager();
const localStorageManager = new LocalStorageManager();
const clientIdsManager = new ClientIdsManager(clientIds);
const settingsManager = new SettingsManager(settings, storageManager);
const gamesManager = new GamesManager(clientIdsManager);
const notificationsManager = new NotificationsManager(channels, settingsManager);
const browserActionManager = new BrowserActionManager(channels);
const channelsManager = new ChannelsManager(
  channels,
  clientIdsManager,
  gamesManager,
  notificationsManager,
  browserActionManager,
  settingsManager
);
const schedulingManager = new SchedulingManager(localStorageManager);
const webSocketManager = new WebSocketManager(webSocketConfig, notificationsManager);

settingsManager.hydrate().then(() => {
  channelsManager.requestTwitchApi();
  channelsManager.enableAutoRequestTwitchApi();
  schedulingManager.getScheduling();
  webSocketManager.connect();
});

chrome.runtime.onMessage.addListener((request: any, sender: chrome.runtime.MessageSender, sendResponse: Function) => {
  switch (request.type) {
    case 'GET_CHANNELS':
      sendResponse({
        data: {
          channels,
        },
      });
      break;
    default:
      sendResponse('Unknown request type.');
  }
});
