import ClientIdsManager from './services/ClientIdsManager';
import ChannelsManager from './services/ChannelsManager';
import GamesManager from './services/GamesManager';

import clientIds from './store/clientIds';
import channels from './store/channels';

const clientIdsManager = new ClientIdsManager(clientIds);
const channelsManager = new ChannelsManager(channels, clientIdsManager);
const gamesManager = new GamesManager(clientIdsManager);

