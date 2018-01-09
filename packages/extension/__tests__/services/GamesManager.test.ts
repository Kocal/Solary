import { GamesManager } from '../../src/services/GamesManager';
import { ClientIdsManager } from '../../src/services/ClientIdsManager';
import clientIds from '../../src/store/clientIds';
import axios from 'axios';

const AxiosMockAdapter = require('axios-mock-adapter');

describe('Service - GamesManager', () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const gamesManager = new GamesManager(new ClientIdsManager(clientIds));

  const url = 'https://api.twitch.tv/helix/games';
  const lsKey = 'solary_twitch_game_';

  axiosMock
    .onGet(url, { params: { id: "21779" } }).replyOnce(200, { "data": [{ "id": "21779", "name": "League of Legends", "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/League%20of%20Legends-{width}x{height}.jpg" }] })
    .onGet(url, { params: { id: "1234567890" } }).replyOnce(200, { "data": [] })
    .onGet(url, { params: { id: "11223344556677889900" } }).replyOnce(500, { "error": "Internal Server Error", "status": 500, "message": "" });

  describe('getNameById()', () => {
    beforeEach(() => {
      localStorage.getItem.mockClear();
      localStorage.setItem.mockClear();
    });

    it('should make a request', async () => {
      const gameId = "21779";
      const game = await gamesManager.getNameById(gameId);

      expect(game).toBe('League of Legends');
      expect(localStorage.getItem).toHaveBeenCalledWith(`${lsKey}${gameId}`);
      expect(localStorage.setItem).toHaveBeenCalledWith(`${lsKey}${gameId}`, 'League of Legends');
    });

    it('should read localStorage', async () => {
      const gameId = "21779";
      const game = await gamesManager.getNameById(gameId);

      expect(game).toBe('League of Legends');
      expect(localStorage.getItem).toHaveBeenCalledWith(`${lsKey}${gameId}`);
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should fail if we request a non-existing game', async () => {
      const gameId = "1234567890";

      try {
        await gamesManager.getNameById(gameId);
      } catch (e) {
        expect(e).toBe(`Le jeu « ${gameId} » n'existe pas.`);
      }
    });

    it('should fail if game id is too high', async () => {
      const gameId = "11223344556677889900";

      console.error = jest.fn();

      try {
        await gamesManager.getNameById(gameId);
      } catch (e) {
        expect(e).toBe(`Erreur lors de la récupération des données du jeu « ${gameId} ».`);
        expect(console.error).toHaveBeenCalled();
      }

      console.error.mockRestore();
    });
  });
});
