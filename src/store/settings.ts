interface Settings {
  [k: string]: SettingsItem;
}

interface SettingsItem {
  type: 'boolean';
  label: string;
  help?: string;
  defaultValue?: any;
  value?: any;
  children?: Settings;
}

const settings: Settings = {
  showNotifications: {
    type: 'boolean',
    label: 'Notifications',
    defaultValue: true,
    children: {
      atBoot: {
        type: 'boolean',
        label: 'Au démarrage du navigateur',
        defaultValue: true,
      },
      onTitleUpdate: {
        type: 'boolean',
        label: 'À chaque nouvelle émission',
        help: "Affiche une notification lorsque d'un stream change de titre.",
        defaultValue: false,
      },
    },
  },
};

export default settings;
export { Settings, SettingsItem };
