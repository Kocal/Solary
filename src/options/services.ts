import { SettingsManager } from '../services/SettingsManager';
import { StorageManager } from '../services/StorageManager';
import settings from '../store/settings';

const storageManager = new StorageManager();
const settingsManager = new SettingsManager(settings, storageManager);

export { settingsManager };
