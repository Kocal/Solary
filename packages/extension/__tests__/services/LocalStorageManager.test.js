import { LocalStorageManager } from '../../src/services/LocalStorageManager';

let localStorageManager;

describe('LocalStorageManager', () => {
  beforeEach(() => {
    localStorageManager = new LocalStorageManager();
    console.error = jest.fn();
  });

  afterEach(() => {
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
  });

  describe('behavior', () => {
    const ttl = 60 * 60;

    test('write in local storage', () => {
      localStorageManager.write('my key', 'my data', ttl);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'my key',
        JSON.stringify({
          data: 'my data',
          timestamp: Math.floor(+new Date() / 1000) + ttl,
        })
      );
    });

    test('return null if data is expired', () => {
      // manually expire data
      const data = JSON.parse(localStorage.getItem('my key'));
      data.timestamp -= ttl - 5; // offset of 5 seconds
      localStorage.setItem('my key', JSON.stringify(data));

      expect(localStorageManager.read()).toBeNull();
    });
  });
});
