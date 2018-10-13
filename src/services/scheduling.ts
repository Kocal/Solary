import { readFromStorage, writeToStorage } from '@kocal/web-extension-library';
import axios from 'axios';

const pageUrl = 'https://www.solary.fr/programme/';
const storageKey = 'solary_scheduling';

export const getScheduling = (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const schedulingUrl: string | null = readFromStorage(storageKey);

    if (schedulingUrl !== null) {
      resolve(schedulingUrl);
      return;
    }

    try {
      const response = await axios.get(pageUrl);
      const matches = response.data.match(/<div class="prog-bg" style="background-image: url\('([^']+)'\);">/);

      if (matches === null) {
        return reject("Erreur lors du parsage du code HTML de la page des programmes. Est-ce qu'il a été modifié ?");
      }

      const [_, imageUri] = matches;
      const imageUrl = new URL(imageUri, 'https://www.solary.fr').href;

      writeToStorage(storageKey, imageUrl, 60 * 60);
      resolve(imageUrl);
    } catch (err) {
      const message = "Une erreur fatale s'est produite lors de la récupération de la programmation.";
      reject(message);
      console.error(message, err);
    }
  });
};
