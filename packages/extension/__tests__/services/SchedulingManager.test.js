import { readFileSync } from 'fs';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import { SchedulingManager } from '../../src/services/SchedulingManager';

const axiosMock = new AxiosMockAdapter(axios);
const localStorageKey = 'solary_scheduling';
const schedulingPageUrl = 'https://www.solary.fr/programme/';
const schedulingUrl = 'http://example.com/programmation.png';

let schedulingManager;

axiosMock
  .onGet(schedulingPageUrl)
  .replyOnce(200, readFileSync(`${__dirname}/__fixtures__/solary/scheduling.html`, 'utf8'))
  .onGet(schedulingPageUrl)
  .replyOnce(200, readFileSync(`${__dirname}/__fixtures__/solary/no-scheduling.html`, 'utf8'))
  .onGet(schedulingPageUrl)
  .replyOnce(500);

describe('SchedulingManager', () => {
  beforeEach(() => {
    schedulingManager = new SchedulingManager();
    console.error = jest.fn();
  });

  afterEach(() => {
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
  });

  describe('behavior', () => {
    test('make a request', async () => {
      localStorage.clear();
      expect(localStorage.getItem(localStorageKey)).toBeNull();

      expect(await schedulingManager.getScheduling()).toBe('https://www.solary.fr/uploads/PLANNING/Capture.JPG');
      expect(localStorage.getItem).toHaveBeenCalledWith(localStorageKey);
      expect(localStorage.setItem).toHaveBeenCalled();
      expect(localStorage.getItem(localStorageKey)).not.toBeNull();
    });

    test('read from cache', async () => {
      expect(localStorage.getItem(localStorageKey)).not.toBeNull();
      expect(await schedulingManager.getScheduling()).toBe('https://www.solary.fr/uploads/PLANNING/Capture.JPG');
      expect(localStorage.getItem).toHaveBeenCalledWith(localStorageKey);
      expect(localStorage.getItem(localStorageKey)).not.toBeNull();
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    test('HTML error', async () => {
      try {
        await schedulingManager.getScheduling();
      } catch (e) {
        expect(e).toBe("Erreur lors du parsage du code HTML de la page des programmes. Est-ce qu'il a été modifié ?");
      }
    });

    test('fatal error', async () => {
      try {
        await schedulingManager.getScheduling();
      } catch (e) {
        expect(e).toBe("Une erreur fatale s'est produite lors de la récupération de la programmation.");
        expect(console.error).toHaveBeenCalled();
      }
    });

    test('write in local storage', () => {
      schedulingManager.write(schedulingUrl);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        localStorageKey,
        JSON.stringify({
          url: schedulingUrl,
          timestamp: Math.floor(+new Date() / 1000) + 60 * 60,
        })
      );
    });

    test('return null if data is expired', () => {
      // manually expire data
      const data = JSON.parse(localStorage.getItem(localStorageKey));
      data.timestamp = Math.floor(+new Date() / 1000) - 60;
      localStorage.setItem(localStorageKey, JSON.stringify(data));

      expect(schedulingManager.read()).toBeNull();
    });
  });
});
