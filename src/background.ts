import { registerSettings, registerTwitchApiKeys } from '@kocal/web-extension-library';
import { getScheduling } from './services/scheduling';
import { fetchTwitchLiveStreams } from './services/twitch-streams';
import channels from './store/channels';
import clientIds from './store/clientIds';
import settings from './store/settings';

registerTwitchApiKeys(clientIds);

(async () => {
  await registerSettings(settings);
  await Promise.all([fetchTwitchLiveStreams(), getScheduling()]);

  setInterval(() => {
    fetchTwitchLiveStreams();
  }, 1000 * 60);
})();

chrome.runtime.onMessage.addListener((request: any, sender: chrome.runtime.MessageSender, sendResponse: Function) => {
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
});
