import { markAsOffline, markAsOnline, setBadgeText, setBrowserActionTitle } from '@kocal/web-extension-library';
import Stream from '../entities/Stream';
import channels from '../store/channels';

setBadgeText('...');

const buildTitleWhenOnline = (): string => {
  return channels
    .filter(channel => channel.online)
    .filter(channel => channel.stream !== null)
    .map(channel => {
      const stream = channel.stream as Stream;
      return `${channel.nickname} joue à ${stream.game} devant ${stream.viewers} viewers\n${stream.title}`;
    })
    .join('\n\n');
};

export const updateBrowserAction = () => {
  if (channels.some(channel => channel.online as boolean)) {
    markAsOnline();
    setBrowserActionTitle(buildTitleWhenOnline());
  } else {
    markAsOffline();
    setBrowserActionTitle('Personne ne stream actuellement sur la TV !');
  }
};
