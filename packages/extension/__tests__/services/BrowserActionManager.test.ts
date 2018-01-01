import channels from '../../src/store/channels';
import { BrowserActionManager } from '../../src/services/BrowserActionManager';
import * as chromeBrowserAction from '../../src/utils/ChromeBrowserAction';

jest.mock('../../src/utils/ChromeBrowserAction');

describe('Service - BrowserActionManager', () => {
  describe('constructor()', () => {
    new BrowserActionManager(channels);

    it('should set browser action in loading state', () => {
      expect(chromeBrowserAction.setBadgeText).toHaveBeenCalledWith('...');
    });
  });
});
