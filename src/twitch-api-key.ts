import { readFromSyncStorage, writeToSyncStorage } from '@kocal/web-extension-library';
import twitchApiKeys from './store/twitch-api-keys';

export async function getTwitchApiKey(): Promise<string> {
  console.debug('Getting Twitch API key from sync storage...');

  let { twitchApiKey } = await readFromSyncStorage('twitchApiKey');

  if (!twitchApiKey) {
    console.debug('No Twitch API key found from sync storage');

    twitchApiKey = twitchApiKeys[Math.floor(Math.random() * twitchApiKeys.length)];

    console.debug(`Saving Twitch API key "${twitchApiKey}" to sync storage`);
    await writeToSyncStorage({ twitchApiKey });
  }

  console.debug(`Using Twitch API key "${twitchApiKey}"`);

  return twitchApiKey;
}
