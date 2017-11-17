class Channel {
  constructor(id, username, nickname, networks = {}) {
    this.id = id;
    this.username = username;
    this.nickname = nickname;
    this.networks = networks;
    this.online = null;
    this.stream = null;
  }

  url() {
    return `https://twitch.tv/${this.username}`;
  }

  markAsOnline(stream) {
    this.online = true;
    this.stream = stream;
  }

  markAsOffline() {
    this.online = false;
    this.stream = null;
  }
}

export default Channel;
