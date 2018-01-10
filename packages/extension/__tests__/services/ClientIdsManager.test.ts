import { ClientIdsManager } from '../../src/services/ClientIdsManager';

describe('Service - BrowserActionManager', () => {
  describe('constructor()', () => {
    it('should throw an error if there is no clients ids', () => {
      expect(() => new ClientIdsManager()).toThrowError('« clientIds » should be a non-empty array.');
    });
  });

  describe('pickOne()', () => {
    it('should pick a random client id', () => {
      const clientIdsManager = new ClientIdsManager(['a', 'b', 'c']);

      const firstIterations = Array.from(new Array(20), () => clientIdsManager.pickOne());
      const secondIterations = Array.from(new Array(20), () => clientIdsManager.pickOne());
      const thirdIterations = Array.from(new Array(20), () => clientIdsManager.pickOne());

      expect(firstIterations).toContain('a');
      expect(secondIterations).toContain('b');
      expect(thirdIterations).toContain('c');
    });
  });
});
