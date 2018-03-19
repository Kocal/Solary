import { NotificationsManager } from '../../src/services/NotificationsManager';
import { SettingsManager } from '../../src/services/SettingsManager';
import Stream from '../../src/entities/Stream';
import channels from '../../src/store/channels';
import settings from '../../src/store/settings';
import { StorageManager } from '../../src/services/StorageManager';

describe('Service - NotificationsManager', () => {
  const storageManager = new StorageManager();
  const settingsManager = new SettingsManager(settings, storageManager);
  const notificationsManager = new NotificationsManager(channels, settingsManager);

  expect(chrome.notifications.onClicked.addListener).toHaveBeenCalled();

  beforeEach(() => {
    chrome.notifications.create.mockReset();
  });

  describe('show()', () => {
    const channel = channels[0];

    it('should log an error if channel is offline', () => {
      console.error = jest.fn();

      channel.markAsOffline();
      notificationsManager.show(channel);

      expect(console.error).toHaveBeenCalledWith(
        "Le channel Solary n'est pas en ligne, impossible d'afficher une notification."
      );
      expect(chrome.notifications.create).not.toHaveBeenCalled();
    });

    it('should create notification', () => {
      const stream = new Stream('League of Legends', 'On détruit les bronzes', 4000);

      channel.markAsOnline(stream);
      notificationsManager.show(channel);

      expect(chrome.notifications.create).toHaveBeenCalledWith('solary', {
        title: 'Solary est en live sur League of Legends !',
        message: 'On détruit les bronzes',
        type: 'basic',
        iconUrl: '../icons/icon_128.png',
      });
    });
  });

  describe('showByTitleAndMessage()', () => {
    const title = 'title';
    const message = 'message';

    notificationsManager.showByTitleAndMessage(title, message);
    expect(chrome.notifications.create).toHaveBeenCalledWith('', {
      title,
      message,
      type: 'basic',
      iconUrl: '../icons/icon_128.png',
    });
  });
});
