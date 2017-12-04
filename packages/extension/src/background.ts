import ClientIdsManager from './services/ClientIdsManager';
import ChannelsManager from './services/ChannelsManager';
import GamesManager from './services/GamesManager';
import NotificationsManager from './services/NotificationsManager';
import SchedulingManager from './services/SchedulingManager';
import BrowserActionManager from './services/BrowserActionManager';
import WebSocketManager from './services/WebSocketManager';

import webSocketConfig from './config/webSocket';
import clientIds from './store/clientIds';
import channels from './store/channels';

const clientIdsManager = new ClientIdsManager(clientIds);
const gamesManager = new GamesManager(clientIdsManager);
const notificationsManager = new NotificationsManager(channels);
const browserActionManager = new BrowserActionManager(channels);
const channelsManager = new ChannelsManager(channels, clientIdsManager, gamesManager, notificationsManager, browserActionManager);
const schedulingManager = new SchedulingManager();
const webSocketManager = new WebSocketManager(webSocketConfig, notificationsManager);

channelsManager.requestTwitchApi();
channelsManager.enableAutoRequestTwitchApi();
schedulingManager.getScheduling();
webSocketManager.connect();

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
