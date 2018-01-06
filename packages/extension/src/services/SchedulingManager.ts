import axios from 'axios';

interface Payload {
  url: string,
  timestamp: number,
}

const timestamp = () => Math.floor((+new Date()) / 1000);

export default class SchedulingManager {
  private ttl: number;
  private pageUrl: string;

  constructor() {
    this.ttl = 60 * 60;
    this.pageUrl = 'https://www.solary.fr/programme/';
  }

  public getScheduling(): Promise<string> {
    return new Promise((resolve, reject) => {
      const schedulingUrl: string | null = this.read();

      if (schedulingUrl !== null) {
        resolve(schedulingUrl);
        return;
      }

      axios.get(this.pageUrl)
        .then(response => response.data)
        .then((html) => {
          /* eslint no-unused-vars: "off" */
          const matches = html.match(/<div class="prog-bg" style="background-image: url\('([^']+)'\);">/);

          if (matches === null) {
            return reject('Erreur lors du parsage du code HTML de la page des programmes. Est-ce qu\'il a été modifié ?');
          }

          const [_, imageUri] = matches;
          const imageUrl = new URL(imageUri, 'https://www.solary.fr').href;

          this.write(imageUrl);
          resolve(imageUrl);
        })
        .catch(error => {
          const message = 'Une erreur fatale s\'est produite lors de la récupération de la programmation.';
          reject(message);
          console.error(message, error);
        });
    });
  }

  private read(): string | null {
    const data = <Payload>JSON.parse(localStorage.getItem('solary_scheduling') || 'false') || null;

    if (data === null || data.timestamp < timestamp()) {
      return null;
    }

    return data.url;
  }

  private write(url: string): void {
    const data: Payload = {
      url,
      timestamp: timestamp() + this.ttl,
    };

    return localStorage.setItem('solary_scheduling', JSON.stringify(data));
  }
}
