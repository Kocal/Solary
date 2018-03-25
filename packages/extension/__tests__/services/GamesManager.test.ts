import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import { GamesManager } from '../../src/services/GamesManager';
import { ClientIdsManager } from '../../src/services/ClientIdsManager';
import clientIds from '../../src/store/clientIds';

const axiosMock = new AxiosMockAdapter(axios);
const twitchApiUrl = 'https://api.twitch.tv/helix/games';
const localStoragePrefix = 'solary_twitch_game_';
let clientIdsManager: ClientIdsManager;
let gamesManager: GamesManager;

axiosMock
  .onGet(twitchApiUrl, { params: { id: '493244' } })
  .replyOnce(200, require('./__fixtures__/api/games'))
  .onGet(twitchApiUrl, { params: { id: '1234567890' } })
  .replyOnce(200, require('./__fixtures__/api/no-games'))
  .onGet(twitchApiUrl, { params: { id: '11223344556677889900' } })
  .replyOnce(500, require('./__fixtures__/api/error-500'));

describe('GamesManager', () => {
  beforeEach(() => {
    clientIdsManager = new ClientIdsManager(clientIds);
    gamesManager = new GamesManager(clientIdsManager);
    console.error = jest.fn();
  });

  afterEach(() => {
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    console.error.mockRestore();
  });

  describe('getNameById()', () => {
    test('make a request', async () => {
      const gameId = '493244';
      const game = await gamesManager.getNameById(gameId);

      expect(game).toBe('Deceit');
      expect(localStorage.getItem).toHaveBeenCalledWith(`${localStoragePrefix}${gameId}`);
      expect(localStorage.setItem).toHaveBeenCalledWith(`${localStoragePrefix}${gameId}`, 'Deceit');
    });

    test('read local storage', async () => {
      const gameId = '493244';
      const game = await gamesManager.getNameById(gameId);

      expect(game).toBe('Deceit');
      expect(localStorage.getItem).toHaveBeenCalledWith(`${localStoragePrefix}${gameId}`);
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    test('fail if we request a non-existing game', async () => {
      const gameId = '1234567890';

      try {
        await gamesManager.getNameById(gameId);
      } catch (e) {
        expect(e).toBe(`Le jeu « ${gameId} » n'existe pas.`);
      }
    });

    test('fail if game id is too high', async () => {
      const gameId = '11223344556677889900';

      try {
        await gamesManager.getNameById(gameId);
      } catch (e) {
        expect(e).toBe(`Erreur lors de la récupération des données du jeu « ${gameId} ».`);
        expect(console.error).toHaveBeenCalled();
      }
    });
  });
});
