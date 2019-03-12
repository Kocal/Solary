import { readFromStorage, writeToStorage } from '@kocal/web-extension-library';
import axios from 'axios';

const pageUrl = 'https://www.solary.fr/programme/';
const storageKey = 'solary_scheduling';

export const getScheduling = async (): Promise<string> => {
  const schedulingUrl: string | null = readFromStorage(storageKey);

  if (schedulingUrl !== null) {
    return schedulingUrl;
  }

  try {
    const response = await axios.get(pageUrl);
    const matches = response.data.match(/<div class="prog-bg" style="background-image: url\('([^']+)'\);">/);

    if (matches === null) {
      throw new Error("Erreur lors du parsage du code HTML de la page des programmes. Est-ce qu'il a été modifié ?");
    }

    const [_, imageUri] = matches;
    const imageUrl = new URL(imageUri, 'https://www.solary.fr').href;

    writeToStorage(storageKey, imageUrl, 60 * 60);
    return imageUrl;
  } catch (err) {
    throw err;
  }
};
