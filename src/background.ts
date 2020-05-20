import { registerSettings, registerTwitchApiKey } from '@kocal/web-extension-library';
import { fetchTwitchLiveStreams } from './services/twitch-streams';
import { getTwitchApiKey } from './twitch-api-key';
import channels from './store/channels';
import settings from './store/settings';

(async (): Promise<void> => {
  registerTwitchApiKey(await getTwitchApiKey());
  await registerSettings(settings);
  await fetchTwitchLiveStreams();

  setInterval(() => {
    fetchTwitchLiveStreams();
  }, 1000 * 60);
})();

chrome.runtime.onMessage.addListener(
  (request: { [k: string]: any }, sender: chrome.runtime.MessageSender, sendResponse: Function) => {
    switch (request.type) {
      case 'GET_CHANNELS':
        sendResponse({
          data: {
            channels,
          },
        });
        break;
      default:
        sendResponse('Unknown request type.');
    }
  }
);
