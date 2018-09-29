import { SettingsManager } from '../services/SettingsManager';
import settings from '../store/settings';

const settingsManager = new SettingsManager(settings);

export { settingsManager };
