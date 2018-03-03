import { StorageManager } from '../../src/popup/StorageManager';

const storageManager = new StorageManager();

describe('Service - StorageManager', () => {
  describe('get() & set()', () => {
    expect(chrome.storage.sync.get).not.toHaveBeenCalled();
    expect(chrome.storage.sync.set).not.toHaveBeenCalled();

    test('behavior', done => {
      // 1st, let fetch 'foo' item
      storageManager.get('foo').then(items => {
        expect(chrome.storage.sync.get).toHaveBeenCalledWith('foo', expect.any(Function));
        expect(typeof items === 'object').toBeTruthy();
        expect(items).toHaveProperty('foo', undefined);

        // 2nd, store { foo: 'bar' }
        storageManager.set({ foo: 'bar' }).then(() => {
          expect(chrome.storage.sync.set).toHaveBeenCalledWith({ foo: 'bar' });

          // 3rd, then we refetch 'foo' item
          storageManager.get('foo').then(items => {
            expect(chrome.storage.sync.get).toHaveBeenCalledWith('foo', expect.any(Function));
            expect(typeof items === 'object').toBeTruthy();
            expect(items).toHaveProperty('foo', 'bar');
            done();
          });
        });
      });
    });
  });
});
