import { SchedulingManager } from '../../src/services/SchedulingManager';
import axios from 'axios';

const AxiosMockAdapter = require('axios-mock-adapter');

describe('Service - SchedulingManager', () => {
  const url = 'https://www.solary.fr/programme/';
  const schedulingManager = new SchedulingManager();
  const axiosMock = new AxiosMockAdapter(axios);

  const cacheKey = 'solary_scheduling';
  const schedulingUrl = 'http://example.com/programmation.png';

  axiosMock
    .onGet(url)
    .replyOnce(200, `<div class="prog-bg" style="background-image: url('/uploads/PLANNING/Capture.JPG');">`)
    .onGet(url)
    .replyOnce(200, `<div style="background-image: url('/uploads/PLANNING/Capture.JPG');">`)
    .onGet(url)
    .replyOnce(500);

  describe('getScheduling - success', async () => {
    expect(await schedulingManager.getScheduling()).toBe('https://www.solary.fr/uploads/PLANNING/Capture.JPG');

    it('should make a request', () => {
      expect(localStorage.getItem).toHaveBeenCalledWith(cacheKey);
      expect(localStorage.getItem(cacheKey)).toBeNull();
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    expect(await schedulingManager.getScheduling()).toBe('https://www.solary.fr/uploads/PLANNING/Capture.JPG');

    it('should read it from cache', () => {
      expect(localStorage.getItem).toHaveBeenCalledWith(cacheKey);
      expect(localStorage.getItem(cacheKey)).not.toBeNull();
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('getScheduling - error', async () => {
    try {
      await schedulingManager.getScheduling();
    } catch (e) {
      expect(e).toBe("Erreur lors du parsage du code HTML de la page des programmes. Est-ce qu'il a été modifié ?");
    }
  });

  describe('getScheduling - fatal error', async () => {
    console.error = jest.fn();

    try {
      await schedulingManager.getScheduling();
    } catch (e) {
      expect(e).toBe("Une erreur fatale s'est produite lors de la récupération de la programmation.");
      expect(console.error).toHaveBeenCalled();
    }

    console.error.mockRestore();
  });

  describe('read and write from localStorage', () => {
    it('localStorage should return null', () => {
      localStorage.clear();

      expect(schedulingManager.read()).toBeNull();
      expect(localStorage.getItem).toHaveBeenCalledWith(cacheKey);
    });

    it('should write in localStorage', () => {
      schedulingManager.write(schedulingUrl);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        cacheKey,
        JSON.stringify({
          url: schedulingUrl,
          timestamp: Math.floor(+new Date() / 1000) + 60 * 60,
        })
      );
    });

    it('should return url from localStorage', () => {
      expect(schedulingManager.read()).toEqual(schedulingUrl);
    });

    it('should return null if data is expired', () => {
      // manually expire data
      const data = JSON.parse(localStorage.getItem(cacheKey));
      data.timestamp = Math.floor(+new Date() / 1000) - 60;
      localStorage.setItem(cacheKey, JSON.stringify(data));

      expect(schedulingManager.read()).toBeNull();
    });
  });
});
