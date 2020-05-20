import { registerSettings, registerTwitchApiKey } from '@kocal/web-extension-library';
import { getTwitchAccessToken } from './services/twitch-authorization';
import { fetchTwitchLiveStreams } from './services/twitch-streams';
import channels from './store/channels';
import settings from './store/settings';
import { getTwitchApiKey } from './twitch-api-key';

(async function app(): Promise<void> {
  registerTwitchApiKey(await getTwitchApiKey());
  const accessToken = await getTwitchAccessToken();
  // TODO: register twitch access token

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
