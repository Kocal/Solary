import {
  registerSettings,
  registerTwitchApiKey,
  registerTwitchAccessToken,
  askTwitchAccessToken,
} from '@kocal/web-extension-library';
import { fetchTwitchLiveStreams } from './services/twitch-streams';
import channels from './store/channels';
import settings from './store/settings';
import { getTwitchApiKey } from './twitch-api-key';

(async function app(): Promise<void> {
  registerTwitchApiKey(await getTwitchApiKey());
  registerTwitchAccessToken(await askTwitchAccessToken());

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
