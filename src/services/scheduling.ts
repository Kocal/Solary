import { writeToStorage, readFromStorage } from '@kocal/web-extension-library';
import axios from 'axios';

const pageUrl = 'https://www.solary.fr/programme/';
const storageKey = 'solary_scheduling';

export const getScheduling = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const schedulingUrl: string | null = readFromStorage(storageKey);

    if (schedulingUrl !== null) {
      resolve(schedulingUrl);
      return;
    }

    return axios
      .get(pageUrl)
      .then(response => response.data)
      .then(html => {
        /* eslint no-unused-vars: "off" */
        const matches = html.match(/<div class="prog-bg" style="background-image: url\('([^']+)'\);">/);

        if (matches === null) {
          return reject("Erreur lors du parsage du code HTML de la page des programmes. Est-ce qu'il a été modifié ?");
        }

        const [_, imageUri] = matches;
        const imageUrl = new URL(imageUri, 'https://www.solary.fr').href;

        writeToStorage(storageKey, imageUrl, 60 * 60);
        resolve(imageUrl);
      })
      .catch(error => {
        const message = "Une erreur fatale s'est produite lors de la récupération de la programmation.";
        reject(message);
        console.error(message, error);
      });
  });
};
