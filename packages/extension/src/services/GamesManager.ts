import axios from 'axios';
import { ClientIdsManager } from './ClientIdsManager';
import { TwitchApi } from '../../typings/TwitchApi';

const read = (id: string) => localStorage.getItem(`solary_twitch_game_${id}`);

const write = (id: string, name: string) => localStorage.setItem(`solary_twitch_game_${id}`, name);

export default class GamesManager {
  constructor(private clientIdsManager: ClientIdsManager) {
  }

  public getNameById(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const name = read(id);

      if (name !== null) {
        return resolve(name);
      }

      this.requestTwitchApi(id)
        .then((game: TwitchApi.Game) => {
          write(id, game.name);
          resolve(game.name);
        })
        .catch(reject);
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

    return axios.get(url, config)
      .then(response => response.data.data[0]);
  }
}
