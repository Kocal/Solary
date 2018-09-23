import Stream from '../../src/entities/Stream';
import { updateBrowserAction } from '../../src/services/browser-action';
import channels from '../../src/store/channels';

describe('BrowserActionManager', () => {
  describe('constructor()', () => {
    test('set browser action in loading state', () => {
      expect(chrome.browserAction.setBadgeText).toHabeBeenLastCalledWith({ text: '...' });
    });
  });

  describe('update()', () => {
    test('set browser action in offline state', () => {
      channels[0].markAsOffline();
      updateBrowserAction();

      expect(chrome.browserAction.setBadgeText).toHabeBeenLastCalledWith({ text: 'OFF' });
      expect(chrome.browserAction.setBadgeBackgroundColor).toHabeBeenLastCalledWith({ color: 'gray' });
      expect(chrome.browserAction.setTitle).toHabeBeenLastCalledWith({
        title: 'Personne ne stream actuellement sur la TV !',
      });
    });

    test('set browser action in online state', () => {
      channels[0].markAsOnline(new Stream('LoL', 'Midi Chapi', 6000, '<thumbnail_url>'));
      channels[1].markAsOnline(new Stream('Fortnite', 'Yoshi et Hunter', 5000, '<thumbnail_url>'));

      updateBrowserAction();

      expect(chrome.browserAction.setBadgeText).toHabeBeenLastCalledWith({ text: 'ON' });
      expect(chrome.browserAction.setBadgeBackgroundColor).toHabeBeenLastCalledWith({ color: 'green' });
      expect(chrome.browserAction.setTitle).toHabeBeenLastCalledWith({
        title: `Solary joue à LoL devant 6000 viewers\nMidi Chapi\n\nSolary Fortnite joue à Fortnite devant 5000 viewers\nYoshi et Hunter`,
      });
    });
  });
});
