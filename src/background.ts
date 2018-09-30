import { registerTwitchApiKeys, registerSettings } from '@kocal/web-extension-library';
import { ChannelsManager } from './services/ChannelsManager';
import { getScheduling } from './services/scheduling';
import channels from './store/channels';
import clientIds from './store/clientIds';
import settings from './store/settings';

registerTwitchApiKeys(clientIds);

const channelsManager = new ChannelsManager(channels);

registerSettings(settings).then(() => {
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
