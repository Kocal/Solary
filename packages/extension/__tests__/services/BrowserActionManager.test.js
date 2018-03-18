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
      channels[1].markAsOnline(new Stream('Fortnite', 'Yoshi et Hunter', 5000, '<thumbnail_url>'));

      browserActionManager.update();

      expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: 'ON' });
      expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: 'green' });
      expect(chrome.browserAction.setTitle).toHaveBeenCalledWith({
        title: `Solary joue à LoL devant 6000 viewers\nMidi Chapi\n\nSolary Fortnite joue à Fortnite devant 5000 viewers\nYoshi et Hunter`,
      });
    });
  });
});
