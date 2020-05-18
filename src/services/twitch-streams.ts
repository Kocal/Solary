import { getSettingValue, getTwitchLiveStreams } from '@kocal/web-extension-library';
import Stream from '../entities/Stream';
import channels from '../store/channels';
import { updateBrowserAction } from './browser-action';
import { createNotificationForChannel } from './notifications';

let firstBoot = true;

export const fetchTwitchLiveStreams = async (): Promise<void> => {
  const { onlineStreams, offlineStreams } = await getTwitchLiveStreams(channels.map((channel) => channel.id));

  onlineStreams.forEach((onlineStream) => {
    const channel = channels.find((channel) => String(channel.id) === onlineStream.user_id) || null;

    if (channel === null) {
      return;
    }

    const wasOffline = !channel.online;
    const titleHasChanged = onlineStream.title !== (channel.stream && channel.stream.title);

    channel.markAsOnline(
      new Stream(onlineStream.game!.name, onlineStream.title, onlineStream.viewer_count, onlineStream.thumbnail_url)
    );

    if (getSettingValue('showNotifications.atBoot') === false && firstBoot) {
      return;
    }

    if (getSettingValue('showNotifications.onTitleUpdate') === true && titleHasChanged) {
      return createNotificationForChannel(channel);
    }

    if (wasOffline) {
      createNotificationForChannel(channel);
    }
  });

  offlineStreams.forEach((offlineStream) => {
    const channel = channels.find((channel) => channel.id === offlineStream) || null;

    if (channel === null) {
      return;
    }

    channel.markAsOffline();
  });

  firstBoot = false;
  updateBrowserAction();
};
