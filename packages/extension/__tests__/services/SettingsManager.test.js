import { StorageManager } from '../../src/services/StorageManager';
import { SettingsManager } from '../../src/services/SettingsManager';

let settings;
let syncSettings;
let storageManager;
let settingsManager;

describe('SettingsManager', () => {
  beforeEach(() => {
    jest.resetModules();
    settings = require('../../src/store/settings').default;
    storageManager = new StorageManager();
    settingsManager = new SettingsManager(settings, storageManager);

    storageManager.get = jest.fn(new StorageManager().get);
    storageManager.set = jest.fn(new StorageManager().set);
  });

  describe('fetch settings', () => {
    it('should hydrate settings values', () => {
      const syncSettings = {
        showNotifications: false,
        'showNotifications.atBoot': false,
        'showNotifications.onTitleUpdate': true,
      };

      storageManager.get.mockReturnValue(new Promise(resolve => resolve({ settings: syncSettings })));

      // Before hydrate, it's using default values
      expect(settingsManager.get('showNotifications')).toBeTruthy();
      expect(settingsManager.get('showNotifications.atBoot')).toBeTruthy();
      expect(settingsManager.get('showNotifications.onTitleUpdate')).toBeFalsy();

      return settingsManager.hydrate().then(() => {
        expect(storageManager.get).toHaveBeenCalledWith('settings');
        expect(settingsManager.get('showNotifications')).toBeFalsy();
        expect(settingsManager.get('showNotifications.atBoot')).toBeFalsy();
        expect(settingsManager.get('showNotifications.onTitleUpdate')).toBeTruthy();
      });
    });
  });

  describe('accessors', () => {
    test('retrieve a setting default value', () => {
      expect(settings.showNotifications.defaultValue).toBeTruthy();
      expect(settings.showNotifications.value).toBeUndefined();
      expect(settingsManager.get('showNotifications')).toBeTruthy();
      expect(storageManager.get).not.toHaveBeenCalled();
    });

    test('retrieve a child setting default value', () => {
      expect(settings.showNotifications.children.atBoot.defaultValue).toBeTruthy();
      expect(settings.showNotifications.children.atBoot.value).toBeUndefined();
      expect(settingsManager.get('showNotifications.atBoot')).toBeTruthy();
      expect(storageManager.get).not.toHaveBeenCalled();
    });

    test('retrieve a setting value', () => {
      settings.showNotifications.value = true;
      expect(settingsManager.get('showNotifications')).toBeTruthy();
      expect(storageManager.get).not.toHaveBeenCalled();

      settings.showNotifications.value = false;
      expect(settingsManager.get('showNotifications')).toBeFalsy();
      expect(storageManager.get).not.toHaveBeenCalled();
    });

    test('retrieve a child setting value', () => {
      settings.showNotifications.children.atBoot.value = true;
      expect(settingsManager.get('showNotifications.atBoot')).toBeTruthy();
      expect(storageManager.get).not.toHaveBeenCalled();

      settings.showNotifications.children.atBoot.value = false;
      expect(settingsManager.get('showNotifications.atBoot')).toBeFalsy();
      expect(storageManager.get).not.toHaveBeenCalled();
    });
  });

  describe('mutators', () => {
    beforeEach(() => {
      settings.showNotifications.value = true;
      settings.showNotifications.children.atBoot.value = true;
      settings.showNotifications.children.onTitleUpdate.value = false;

      syncSettings = {
        showNotifications: true,
        'showNotifications.atBoot': true,
        'showNotifications.onTitleUpdate': false,
      };
    });

    test('mutate setting value', () => {
      settingsManager.set('showNotifications', false);
      syncSettings.showNotifications = false;
      expect(storageManager.set).toHaveBeenCalledWith({ settings: syncSettings });
      expect(settings.showNotifications.defaultValue).toBeTruthy();
      expect(settings.showNotifications.value).toBeFalsy();

      settingsManager.set('showNotifications', true);
      syncSettings.showNotifications = true;
      expect(storageManager.set).toHaveBeenCalledWith({ settings: syncSettings });
      expect(settings.showNotifications.defaultValue).toBeTruthy();
      expect(settings.showNotifications.value).toBeTruthy();
    });

    test('mutate children setting value', done => {
      settingsManager.set('showNotifications.atBoot', false).then(() => {
        syncSettings['showNotifications.atBoot'] = false;
        expect(storageManager.set).toHaveBeenCalledWith({ settings: syncSettings });
        expect(settings.showNotifications.children.atBoot.defaultValue).toBeTruthy();
        expect(settings.showNotifications.children.atBoot.value).toBeFalsy();

        settingsManager.set('showNotifications.atBoot', true).then(() => {
          syncSettings['showNotifications.atBoot'] = true;
          expect(storageManager.set).toHaveBeenCalledWith({ settings: syncSettings });
          expect(settings.showNotifications.children.atBoot.defaultValue).toBeTruthy();
          expect(settings.showNotifications.children.atBoot.value).toBeTruthy();
          done();
        });
      });
    });
  });
});
