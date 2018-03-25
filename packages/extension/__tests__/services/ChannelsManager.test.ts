import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import Channel from '../../src/entities/Channel';
import { BrowserActionManager } from '../../src/services/BrowserActionManager';
import { ChannelsManager } from '../../src/services/ChannelsManager';
import { ClientIdsManager } from '../../src/services/ClientIdsManager';
import { GamesManager } from '../../src/services/GamesManager';
import { NotificationsManager } from '../../src/services/NotificationsManager';
import { SettingsManager } from '../../src/services/SettingsManager';
import { StorageManager } from '../../src/services/StorageManager';
import { Settings } from '../../src/store/settings';

const qs: any = require('qs');

let channels: Channel[];
let clientIds: string[];
let settings: Settings;
let storageManager: StorageManager;
let settingsManager: SettingsManager;
let clientIdsManager: ClientIdsManager;
let gamesManager: GamesManager;
let notificationsManager: NotificationsManager;
let browserActionManager: BrowserActionManager;
let channelsManager: ChannelsManager;

const axiosMock = new AxiosMockAdapter(axios);
const paramsSerializer = (params: object) => qs.stringify(params, { arrayFormat: 'repeat' });

axiosMock
  .onGet('https://api.twitch.tv/helix/streams', { paramsSerializer, params: { user_id: [174955366, 198506129] } })
  .replyOnce(200, require('./__fixtures__/api/streams'))
  .onGet('https://api.twitch.tv/helix/streams', { paramsSerializer, params: { user_id: [174955366, 198506129] } })
  .replyOnce(200, require('./__fixtures__/api/no-streams'))
  .onGet('https://api.twitch.tv/helix/games', { params: { id: '493244' } })
  .reply(200, require('./__fixtures__/api/games'));

describe('ChannelsManager', () => {
  beforeEach(() => {
    channels = require('../../src/store/channels').default;
    clientIds = require('../../src/store/clientIds').default;
    settings = require('../../src/store/settings').default;

    storageManager = new StorageManager();
    settingsManager = new SettingsManager(settings, storageManager);
    clientIdsManager = new ClientIdsManager(clientIds);
    gamesManager = new GamesManager(clientIdsManager);
    notificationsManager = new NotificationsManager(channels, settingsManager);
    browserActionManager = new BrowserActionManager(channels);
    channelsManager = new ChannelsManager(
      channels,
      clientIdsManager,
      gamesManager,
      notificationsManager,
      browserActionManager,
      settingsManager
    );

    chrome.notifications.create.mockReset();
    chrome.browserAction.setBadgeText.mockReset();
    chrome.browserAction.setBadgeBackgroundColor.mockReset();
    chrome.browserAction.setTitle.mockReset();
  });

  describe('requestTwitchApi()', () => {
    test('go online', async () => {
      channels.forEach(channel => channel.markAsOffline());
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
        title: `Solary joue à Deceit devant 4263 viewers\nSOLARY TEAM D'AMIS AVANT CE JEU`,
      });
    });

    test('go offline', async () => {
      await channelsManager.requestTwitchApi();

      expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: 'OFF' });
      expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: 'gray' });
      expect(chrome.browserAction.setTitle).toHaveBeenCalledWith({
        title: 'Personne ne stream actuellement sur la TV !',
      });
    });
  });
});
