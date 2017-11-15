import axios from 'axios';

const read = (id) => {
  return localStorage.getItem(`solary_twitch_game_${id}`);
};

const write = (id, name) => {
  return localStorage.setItem(`solary_twitch_game_${id}`, name);
};

class GamesManager {
  constructor(clientIdsManager) {
    this.clientIdsManager = clientIdsManager;
  }

  getNameById(id) {
    return new Promise((resolve, reject) => {
      const name = read(id);

      if (name !== null) {
        return resolve(name);
      }

      this.requestTwitchApi(id)
        .then(game => {
          write(id, game.name);
          resolve(game.name);
        })
        .catch(reject);
    });
  }

  requestTwitchApi(id) {
    const url = 'https://api.twitch.tv/helix/games';
    const config = {
      headers: {
        'Client-ID': this.clientIdsManager.pickOne()
      },
      params: {
        id
      }
    };

    return axios.get(url, config)
      .then(response => response.data.data[0]);
  }
}

export default GamesManager