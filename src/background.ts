import { registerTwitchApiKeys } from '@kocal/web-extension-library';
import { ChannelsManager } from './services/ChannelsManager';
import { NotificationsManager } from './services/NotificationsManager';
import { getScheduling } from './services/scheduling';
import { SettingsManager } from './services/SettingsManager';
import { StorageManager } from './services/StorageManager';
import channels from './store/channels';
import clientIds from './store/clientIds';
import settings from './store/settings';

registerTwitchApiKeys(clientIds);

const storageManager = new StorageManager();
const settingsManager = new SettingsManager(settings, storageManager);
const notificationsManager = new NotificationsManager(settingsManager);
const channelsManager = new ChannelsManager(channels, notificationsManager, settingsManager);

settingsManager.hydrate().then(() => {
  channelsManager.requestTwitchApi();
  channelsManager.enableAutoRequestTwitchApi();
  getScheduling();
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
