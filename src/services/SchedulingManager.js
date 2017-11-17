import axios from 'axios';

const timestamp = () => {
  return parseInt((+new Date()) / 1000, 10);
};

class SchedulingManager {
  constructor() {
    this.ttl = 86400; // 1 jour
    this.pageUrl = 'https://www.solary.fr/programme/';
  }

  getScheduling() {
    return new Promise((resolve, reject) => {
      const imageUrl = this.read();

      if (imageUrl !== null) {
        resolve(imageUrl);
        return;
      }

      axios.get(this.pageUrl)
        .then(response => response.data)
        .then(html => {
          let [_, imageUrl] = html.match(/<div class="prog-bg" style="background-image: url\('([^']+)'\);">/);

          imageUrl = `https://www.solary.fr/${imageUrl}`;

          this.write(imageUrl);
          resolve(imageUrl);
        })
        .catch(error => reject(error));
    });
  }

  read() {
    const data = JSON.parse(localStorage.getItem(`solary_scheduling`));

    if (data === null) {
      return null;
    }

    if (data.timestamp < timestamp()) {
      return null;
    }

    return data.url;
  };

  write(url) {
    const data = {
      url,
      timestamp: timestamp() + this.ttl
    };

    return localStorage.setItem(`solary_scheduling`, JSON.stringify(data));
  };
}

export default SchedulingManager