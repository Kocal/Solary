import { registerTwitchApiKeys } from '@kocal/web-extension-library';
import { ChannelsManager } from './services/ChannelsManager';
import { GamesManager } from './services/GamesManager';
import { LocalStorageManager } from './services/LocalStorageManager';
import { NotificationsManager } from './services/NotificationsManager';
import { SchedulingManager } from './services/SchedulingManager';
import { SettingsManager } from './services/SettingsManager';
import { StorageManager } from './services/StorageManager';
import channels from './store/channels';
import clientIds from './store/clientIds';
import settings from './store/settings';

registerTwitchApiKeys(clientIds);

const storageManager = new StorageManager();
const localStorageManager = new LocalStorageManager();
const settingsManager = new SettingsManager(settings, storageManager);
const gamesManager = new GamesManager();
const notificationsManager = new NotificationsManager(channels, settingsManager);
const channelsManager = new ChannelsManager(channels, gamesManager, notificationsManager, settingsManager);
const schedulingManager = new SchedulingManager(localStorageManager);

settingsManager.hydrate().then(() => {
  channelsManager.requestTwitchApi();
  channelsManager.enableAutoRequestTwitchApi();
  schedulingManager.getScheduling();
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
