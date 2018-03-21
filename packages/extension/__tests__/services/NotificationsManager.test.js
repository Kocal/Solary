import { NotificationsManager } from '../../src/services/NotificationsManager';
import { SettingsManager } from '../../src/services/SettingsManager';
import { StorageManager } from '../../src/services/StorageManager';
import Stream from '../../src/entities/Stream';
import channels from '../../src/store/channels';
import settings from '../../src/store/settings';

let storageManager;
let settingsManager;
let notificationsManager;

describe('NotificationsManager', () => {
  beforeEach(() => {
    storageManager = new StorageManager();
    settingsManager = new SettingsManager(settings, storageManager);
    notificationsManager = new NotificationsManager(channels, settingsManager);

    console.error = jest.fn();
    expect(chrome.notifications.onClicked.addListener).toHaveBeenCalled();
  });

  afterEach(() => {
    console.error.mockReset();
    chrome.notifications.create.mockReset();
  });

  describe('show()', () => {
    const channel = channels[0];

    test('log an error if channel is offline', () => {
      channel.markAsOffline();
      notificationsManager.show(channel);

      expect(console.error).toHaveBeenCalledWith(
        "Le channel Solary n'est pas en ligne, impossible d'afficher une notification."
      );
      expect(chrome.notifications.create).not.toHaveBeenCalled();
    });

    test('create notification', () => {
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

    test('create notification', () => {
      notificationsManager.showByTitleAndMessage(title, message);
      expect(chrome.notifications.create).toHaveBeenCalledWith('', {
        title,
        message,
        type: 'basic',
        iconUrl: '../icons/icon_128.png',
      });
    });
  });
});
