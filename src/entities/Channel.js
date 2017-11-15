class Channel {
  constructor(id, username, nickname, networks = {}) {
    this.id = id;
    this.username = username;
    this.nickname = nickname;
    this.networks = networks;
  }

  url() {
    return `https://twitch.tv/${this.username}`;
  }
}

export default Channel