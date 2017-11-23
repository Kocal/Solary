const isProduction = process.env.NODE_ENV === 'production';

export default {
  url: isProduction ? 'wss://solary.kocal.fr/ws' : 'wss://localhost.ssl:3000',
};
