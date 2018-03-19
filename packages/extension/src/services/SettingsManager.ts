import { Settings, SettingsItem } from '../store/settings';
import { StorageManager } from './StorageManager';

class SettingsManager {
  constructor(private settings: Settings, private storageManager: StorageManager) {}

  hydrate(): Promise<void> {
    return new Promise(resolve =>
      this.storageManager.get('settings').then(items => {
        const { settings } = items;

        if (settings !== undefined) {
          Object.entries(settings).forEach(([dottedName, value]: [string, any]) => {
            this.set(dottedName, value, false);
          });
        }

        resolve();
      })
    );
  }

  get(key: string): any {
    const setting = this.resolve(key);

    if (setting === undefined) return undefined;
    if (setting.value === undefined) return setting.defaultValue;

    return setting.value;
  }

  set(key: string, value: any, sync: boolean = true): Promise<void> | void {
    const setting = this.resolve(key);
    const previousValue = this.get(key);

    if (setting === undefined) return;

    setting.value = value;

    if (!sync) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.storageManager
        .set({ settings: this.getFlattenSettings() })
        .then(() => resolve())
        .catch(() => {
          setting.value = previousValue;
          reject();
        });
    });
  }

  getSettings(): Settings {
    return this.settings;
  }

  getFlattenSettings(): { [k: string]: any } {
    const settings: { [k: string]: any } = {};

    this.recursivelyIterate(this.settings, (dottedName: string, setting: SettingsItem) => {
      settings[dottedName] = this.get(dottedName);
    });

    return settings;
  }

  private resolve(key: string): SettingsItem | undefined {
    const keyParts = key.split('.');
    let setting: SettingsItem | undefined = this.settings[keyParts[0]];

    if (keyParts.length === 1) return setting;

    while (true) {
      keyParts.shift();

      if (keyParts.length === 0) return setting;
      if (setting === undefined || setting.children === undefined) return undefined;

      setting = setting.children[keyParts[0]];
    }
  }

  private recursivelyIterate(settings: Settings, cb: Function, prefix: string = ''): void {
    Object.entries(settings).forEach(([name, setting]: [string, SettingsItem]) => {
      if (setting.children) {
        this.recursivelyIterate(setting.children, cb, `${name}.`);
      }

      cb(`${prefix}${name}`, setting);
    });
  }
}

export { SettingsManager };
