// Ce fichier sera déplacé dans @kocal/web-extension-library
import { readFromSyncStorage, writeToSyncStorage } from '@kocal/web-extension-library';
import axios from 'axios';
import * as qs from 'qs';
import { getTwitchApiKey } from '../twitch-api-key';

const oAuthUrl = 'https://id.twitch.tv/oauth2';

let authorization = null;

// https://dev.twitch.tv/docs/authentication/getting-tokens-oauth
// https://developer.chrome.com/extensions/identity#method-launchWebAuthFlow
async function askTwitchAuthorization(clientId: string, interactive: boolean = false) {
  const redirectUri = chrome.identity
    .getRedirectURL('twitch')
    .replace('extensions.allizom.org', 'extensions.mozilla.org');

  const params = {
    client_id: clientId,
    redirect_uri: encodeURI(redirectUri),
    response_type: 'token',
    ...(interactive ? { force_verify: true } : {})
  };

  console.log(params);
  const url = `${oAuthUrl}/authorize?${qs.stringify(params)}`;

  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow({ url, interactive }, (responseUrl) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      if (!responseUrl) {
        reject(new Error('No responseUrl from Twitch OAuth'));
        return;
      }

      try {
        console.log(responseUrl);
        const str = responseUrl.split('access_token=')[1];
        if (!str) {
          const errStr = responseUrl.split('error=')[1];
          if (!errStr) {
            reject(new Error('Unknown responseUrl'));
            return;
          }

          const [title, desc] = errStr.split('&error_description=');

          reject(new Error(`${title}: ${desc.replace(/\+/g, ' ')}`));
          return;
        }

        const accessToken = responseUrl.split('access_token=')[1].split('&')[0];
        resolve(accessToken);
      } catch (error) {
        reject(error);
      }
    });
  });
};

async function validateAccessToken(accessToken: string): Promise<any> {
  return axios.get(`${oAuthUrl}/validate`, {
    headers: {
      Authorization: `OAuth ${accessToken}`
    }
  });
}

export async function getTwitchAccessToken(force = false) {
  let { twitchAuthorization } = await readFromSyncStorage(['twitchAuthorization']);
  let accessToken = twitchAuthorization?.accessToken || null;

  console.debug({ twitchAuthorization })
  const isExpired = twitchAuthorization?.expirationTimestamp ? new Date(twitchAuthorization.expirationTimestamp) <= new Date() : false;

  if (force || accessToken === null || isExpired) {
    try {
      console.debug('asking for twitch authorization');

      accessToken = await askTwitchAuthorization(await getTwitchApiKey(), true);
      twitchAuthorization = await validateAccessToken(accessToken);
      twitchAuthorization = {
        ...twitchAuthorization,
        accessToken,
        expirationTimestamp: (new Date()).getTime() + twitchAuthorization.expires_in * 1000
      };

      await writeToSyncStorage({ twitchAuthorization });
    } catch (error) {
      throw error;
    }
  }

  return accessToken;
}
