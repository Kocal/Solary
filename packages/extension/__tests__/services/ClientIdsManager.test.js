import { ClientIdsManager } from '../../src/services/ClientIdsManager';

describe('BrowserActionManager', () => {
  describe('constructor()', () => {
    test('throw an error if there is no clients ids', () => {
      expect(() => new ClientIdsManager()).toThrowError('« clientIds » should be a non-empty array.');
    });
  });

  describe('pickOne()', () => {
    test('pick a random client id', () => {
      const clientIds = ['a', 'b', 'c'];
      const clientIdsManager = new ClientIdsManager(clientIds);

      const randomlyPickedClientIds = Array.from(new Array(20), () => clientIdsManager.pickOne());

      expect(randomlyPickedClientIds).toContain('a');
      expect(randomlyPickedClientIds).toContain('b');
      expect(randomlyPickedClientIds).toContain('c');
    });
  });
});
