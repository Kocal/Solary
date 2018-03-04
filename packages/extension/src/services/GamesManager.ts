import axios from 'axios';
import { TwitchApi } from '../../typings/TwitchApi';
import { ClientIdsManager } from './ClientIdsManager';

const read = (id: string): string | null => localStorage.getItem(`solary_twitch_game_${id}`) || null;

const write = (id: string, name: string) => localStorage.setItem(`solary_twitch_game_${id}`, name);

class GamesManager {
  constructor(private clientIdsManager: ClientIdsManager) {}

  public getNameById(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const name = read(id);

      if (name !== null) {
        return resolve(name);
      }

      this.requestTwitchApi(id)
        .then((game: TwitchApi.Game | null) => {
          if (game === null) {
            return reject(`Le jeu « ${id} » n'existe pas.`);
          }

          write(id, game.name);
          return resolve(game.name);
        })
        .catch(error => {
          const message = `Erreur lors de la récupération des données du jeu « ${id} ».`;

          console.error(message, error);
          reject(message);
        });
    });
  }

  private requestTwitchApi(id: string): Promise<TwitchApi.Game> {
    const url = 'https://api.twitch.tv/helix/games';
    const config = {
      headers: {
        'Client-ID': this.clientIdsManager.pickOne(),
      },
      params: {
        id,
      },
    };

    return axios.get(url, config).then(response => {
      const { data } = response;

      if (!('data' in data) || data.data.length === 0) {
        return null;
      }

      return data.data[0];
    });
  }
}

export { GamesManager };
