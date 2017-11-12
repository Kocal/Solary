class Channel {
  constructor(username, nickname, networks = {}) {
    this.username = username;
    this.nickname = nickname;
    this.networks = networks;
  }

  url() {
    return `https://twitch.tv/${this.username}`;
  }
}

export default Channel