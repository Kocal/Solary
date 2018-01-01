import channels from '../../src/store/channels';
import { BrowserActionManager } from '../../src/services/BrowserActionManager';
import * as chromeBrowserAction from '../../src/utils/ChromeBrowserAction';
import Stream from '../../src/entities/Stream';

jest.mock('../../src/utils/ChromeBrowserAction');

describe('Service - BrowserActionManager', () => {
  describe('constructor()', () => {
    new BrowserActionManager(channels);

    it('should set browser action in loading state', () => {
      expect(chromeBrowserAction.setBadgeText).toHaveBeenCalledWith('...');
    });
  });

  describe('update()', () => {
    const browserActionManager = new BrowserActionManager(channels);

    beforeEach(() => {
      chromeBrowserAction.setBadgeText.mockReset();
      chromeBrowserAction.setBadgeColor.mockReset();
      chromeBrowserAction.setTitle.mockReset();
    });

    it('should set browser action in offline state', () => {
      channels[0].markAsOffline();
      browserActionManager.update();

      expect(chromeBrowserAction.setBadgeText).toHaveBeenCalledWith('OFF');
      expect(chromeBrowserAction.setBadgeColor).toHaveBeenCalledWith('gray');
      expect(chromeBrowserAction.setTitle).toHaveBeenCalledWith('Personne ne stream actuellement sur la TV !');
    });

    it('should set browser action in online state', () => {
      channels[0].markAsOnline(new Stream('LoL', 'Midi Chapi', 6000, '<thumbnail_url>'));

      browserActionManager.update();

      expect(chromeBrowserAction.setBadgeText).toHaveBeenCalledWith('ON');
      expect(chromeBrowserAction.setBadgeColor).toHaveBeenCalledWith('green');
      expect(chromeBrowserAction.setTitle).toHaveBeenCalledWith(`Midi Chapi\n\nJoue à LoL devant 6000 viewers`);
    });

    it('should not touch browser action state if no Solary streams found (should not happens)', () => {
      channels[0].username = 'melon';

      browserActionManager.update();

      expect(chromeBrowserAction.setBadgeText).not.toHaveBeenCalled();
      expect(chromeBrowserAction.setBadgeColor).not.toHaveBeenCalled();
      expect(chromeBrowserAction.setTitle).not.toHaveBeenCalled();
    })
  });
});
