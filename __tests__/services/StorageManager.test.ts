import { StorageManager } from '../../src/services/StorageManager';

const storageManager = new StorageManager();

describe('Service - StorageManager', () => {
  test('behavior', done => {
    // 1st, let fetch 'foo' item
    storageManager.get('foo').then(items => {
      expect(typeof items === 'object').toBeTruthy();
      expect(items).toHaveProperty('foo', undefined);
      // 2nd, store { foo: 'bar' }
      storageManager.set({ foo: 'bar' }).then(() => {
        // 3rd, then we refetch 'foo' item
        storageManager.get('foo').then(items => {
          expect(typeof items === 'object').toBeTruthy();
          expect(items).toHaveProperty('foo', 'bar');
          done();
        });
      });
    });
  });
});
