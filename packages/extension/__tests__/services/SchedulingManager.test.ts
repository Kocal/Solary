import SchedulingManager from "../../src/services/SchedulingManager";

describe('Service - SchedulingManager', () => {
  const schedulingManager = new SchedulingManager();

  describe('getScheduling - success', () => {

  });

  describe('getScheduling - error', () => {

  });

  describe('getScheduling - fatal error', () => {

  });

  describe('read and write from localStorage', () => {
    const lsKey = 'solary_scheduling';
    const url = 'http://example.com/programmation.png';

    it('localStorage should return null', () => {
      expect(schedulingManager.read()).toBeNull();
      expect(localStorage.getItem).toHaveBeenCalledWith(lsKey);
    });

    it('should write in localStorage', () => {
      schedulingManager.write(url);
      expect(localStorage.setItem).toHaveBeenCalledWith(lsKey, JSON.stringify({
        url,
        timestamp: Math.floor(+new Date() / 1000) + 60 * 60,
      }));
    });

    it('should return url from localStorage', () => {
      expect(schedulingManager.read()).toEqual(url);
    });

    it('should return null if data is expired', () => {
      // manually expire data
      const data = JSON.parse(localStorage.getItem(lsKey));
      data.timestamp = Math.floor(+ new Date() / 1000) - 60;
      localStorage.setItem(lsKey, JSON.stringify(data));

      expect(schedulingManager.read()).toBeNull();
    });
  });
});
