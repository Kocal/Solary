import ClientIdsManager from './services/ClientIdsManager';
import ChannelsManager from './services/ChannelsManager';
import GamesManager from './services/GamesManager';
import NotificationsManager from './services/NotificationsManager';

import clientIds from './store/clientIds';
import channels from './store/channels';
import SchedulingManager from "./services/SchedulingManager";

const clientIdsManager = new ClientIdsManager(clientIds);
const gamesManager = new GamesManager(clientIdsManager);
const notificationsManager = new NotificationsManager(channels);
const channelsManager = new ChannelsManager(channels, clientIdsManager, gamesManager, notificationsManager);
const schedulingManager = new SchedulingManager();

channelsManager.requestTwitchApi();
channelsManager.enableAutoRequestTwitchApi();
schedulingManager.getScheduling();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'GET_CHANNELS':
      sendResponse({
        data: {
          channels: channelsManager.channels
        }
      });
      break;
    default:
      sendResponse('Unknown request type.');
  }
});