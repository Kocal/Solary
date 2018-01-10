import channels from '../../src/store/channels';
import { BrowserActionManager } from '../../src/services/BrowserActionManager';
import Stream from '../../src/entities/Stream';

describe('Service - BrowserActionManager', () => {
  describe('constructor()', () => {
    new BrowserActionManager(channels);

    it('should set browser action in loading state', () => {
      expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: '...' });
    });
  });

  describe('update()', () => {
    const browserActionManager = new BrowserActionManager(channels);

    beforeEach(() => {
      chrome.browserAction.setBadgeText.mockReset();
      chrome.browserAction.setBadgeBackgroundColor.mockReset();
      chrome.browserAction.setTitle.mockReset();
    });

    it('should set browser action in offline state', () => {
      channels[0].markAsOffline();
      browserActionManager.update();

      expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: 'OFF' });
      expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: 'gray' });
      expect(chrome.browserAction.setTitle).toHaveBeenCalledWith({
        title: 'Personne ne stream actuellement sur la TV !',
      });
    });

    it('should set browser action in online state', () => {
      channels[0].markAsOnline(new Stream('LoL', 'Midi Chapi', 6000, '<thumbnail_url>'));

      browserActionManager.update();

      expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: 'ON' });
      expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: 'green' });
      expect(chrome.browserAction.setTitle).toHaveBeenCalledWith({
        title: `Midi Chapi\n\nJoue à LoL devant 6000 viewers`,
      });
    });

    it('should not touch browser action state if no Solary streams found (should not happens)', () => {
      channels[0].username = 'melon';

      browserActionManager.update();

      expect(chrome.browserAction.setBadgeText).not.toHaveBeenCalled();
      expect(chrome.browserAction.setBadgeBackgroundColor).not.toHaveBeenCalled();
      expect(chrome.browserAction.setTitle).not.toHaveBeenCalled();
    });
  });
});
