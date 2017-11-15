import ClientIdsManager from './services/ClientIdsManager';
import ChannelsManager from './services/ChannelsManager';
import GamesManager from './services/GamesManager';

import clientIds from './store/clientIds';
import channels from './store/channels';

const clientIdsManager = new ClientIdsManager(clientIds);
const gamesManager = new GamesManager(clientIdsManager);
const channelsManager = new ChannelsManager(channels, clientIdsManager, gamesManager);

channelsManager.requestTwitchApi();
channelsManager.enableAutoRequestTwitchApi();
