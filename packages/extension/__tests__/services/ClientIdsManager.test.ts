import { ClientIdsManager } from '../../src/services/ClientIdsManager';

describe('BrowserActionManager', () => {
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
