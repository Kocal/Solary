import { InterfaceSettings } from '@kocal/web-extension-library';

const settings: InterfaceSettings = {
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
