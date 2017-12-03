import { WebSocketConfig } from '../../typings/configs';

export default {
  url: process.env.NODE_ENV === 'production'
    ? 'wss://solary.kocal.fr'
    : 'wss://localhost.ssl:3000',
} as WebSocketConfig;
