import Solary from './Solary';
import ClientIdsManager from './services/ClientIdsManager';
import ChannelsManager from './services/ChannelsManager';
import clientIds from './store/clientIds';
import channels from './store/channels';

const clientIdsManager = new ClientIdsManager(clientIds);
const channelsManager = new ChannelsManager(channels, clientIdsManager);

global.solary = new Solary(channelsManager);