import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
const axiosMock = new AxiosMockAdapter(axios);

import channels from '../../src/store/channels';
import clientIds from '../../src/store/clientIds';
import { ChannelsManager } from '../../src/services/ChannelsManager';
import { ClientIdsManager } from '../../src/services/ClientIdsManager';
import { GamesManager } from '../../src/services/GamesManager';
import { NotificationsManager } from '../../src/services/NotificationsManager';
import { BrowserActionManager } from '../../src/services/BrowserActionManager';

axiosMock
  .onGet('https://api.twitch.tv/helix/streams', { params: { user_id: [174955366] } })
  .replyOnce(200, {
    data: [
      {
        id: '27218318352',
        user_id: '174955366',
        game_id: '493244',
        community_ids: [],
        type: 'live',
        title: "SOLARY TEAM D'AMIS AVANT CE JEU",
        viewer_count: 4263,
        started_at: '2018-01-09T07:27:59Z',
        language: 'en-gb',
        thumbnail_url: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_solary-{width}x{height}.jpg',
      },
    ],
    pagination: { cursor: 'eyJiIjpudWxsLCJhIjp7Ik9mZnNldCI6MX19' },
  })
  .onGet('https://api.twitch.tv/helix/streams', { params: { user_id: [174955366] } })
  .replyOnce(200, { data: [], pagination: {} })
  .onGet('https://api.twitch.tv/helix/games', { params: { id: '493244' } })
  .reply(200, {
    data: [
      {
        id: '493244',
        name: 'Deceit',
        box_art_url: 'https://static-cdn.jtvnw.net/ttv-boxart/Deceit-{width}x{height}.jpg',
      },
    ],
  });

describe('Service - ChannelsManager', () => {
  const clientIdsManager = new ClientIdsManager(clientIds);
  const gamesManager = new GamesManager(clientIdsManager);
  const notificationsManager = new NotificationsManager(channels);
  const browserActionManager = new BrowserActionManager(channels);
  const channelsManager = new ChannelsManager(
    channels,
    clientIdsManager,
    gamesManager,
    notificationsManager,
    browserActionManager
  );

  beforeEach(() => {
    chrome.notifications.create.mockReset();
    chrome.browserAction.setBadgeText.mockReset();
    chrome.browserAction.setBadgeBackgroundColor.mockReset();
    chrome.browserAction.setTitle.mockReset();
  });

  describe('requestTwitchApi()', () => {
    it('should go online', async () => {
      channels[0].markAsOffline();
      await channelsManager.requestTwitchApi();

      expect(chrome.notifications.create).toHaveBeenCalledWith('solary', {
        iconUrl: '../icons/icon_128.png',
        message: "SOLARY TEAM D'AMIS AVANT CE JEU",
        title: 'Solary est en live sur Deceit !',
        type: 'basic',
      });
      expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: 'ON' });
      expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: 'green' });
      expect(chrome.browserAction.setTitle).toHaveBeenCalledWith({
        title: `SOLARY TEAM D'AMIS AVANT CE JEU\n\nJoue à Deceit devant 4263 viewers`,
      });
    });

    it('should go offline', async () => {
      await channelsManager.requestTwitchApi();

      expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: 'OFF' });
      expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: 'gray' });
      expect(chrome.browserAction.setTitle).toHaveBeenCalledWith({
        title: 'Personne ne stream actuellement sur la TV !',
      });
    });
  });
});
