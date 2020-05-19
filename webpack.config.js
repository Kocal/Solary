const childProcess = require('child_process');
const webpack = require('webpack');
const Encore = require('@symfony/webpack-encore');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { version } = require('./package.json');

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
  Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
  .setOutputPath('dist')
  .setPublicPath('/')
  .disableSingleRuntimeChunk()
  .splitEntryChunks()
  .configureSplitChunks(options => {
    options.chunks = 'all';
    options.name = 'vendor';
  })

  .addEntry('background', './src/background.ts')
  .addEntry('popup/popup', './src/popup/popup.ts')
  .addEntry('options/options', './src/options/options.ts')

  .addPlugin(new HtmlWebpackPlugin({
    chunks: ['popup/popup'],
    template: 'src/popup/popup.html',
    filename: 'popup/popup.html',
  }))
  .addPlugin(new HtmlWebpackPlugin({
    chunks: ['options/options'],
    template: 'src/options/options.html',
    filename: 'options/options.html',
  }))
  .addPlugin(new CopyWebpackPlugin({
    patterns: [
      { from: 'src/icons', to: 'icons', globOptions: { ignore: ['icon.xcf'] } },
      {
        from: 'src/manifest.json',
        to: 'manifest.json',
        transform(content) {
          const contentJson = JSON.parse(content);
          contentJson.version = version;

          if (Encore.isDev()) {
            contentJson['content_security_policy'] = "script-src 'self' 'unsafe-eval'; object-src 'self'";
          }

          return JSON.stringify(contentJson, null, 2);
        },
      },
    ],
  }))
  .configureManifestPlugin(options => {
    options.fileName = 'webpack-manifest.json';
  })

  /*
   * FEATURE CONFIG
   *
   * Enable & configure other features below. For a full
   * list of features, see:
   * https://symfony.com/doc/current/frontend.html#adding-more-features
   */
  .cleanupOutputBeforeBuild()
  .enableSourceMaps(!Encore.isProduction())
  .enableSassLoader(options => {
    options.implementation = require('sass');
  })
  .enableVueLoader()
  .enableTypeScriptLoader()
;

if (Encore.isProduction()) {
  const exec = (command) => childProcess.execSync(command).toString().trim();

  const gitRevision = exec('git rev-parse --abbrev-ref HEAD');
  const gitBranchOrTag = gitRevision === 'HEAD' ? exec('git describe --tags --abbrev=0') : gitRevision;

  Encore.addPlugin(new webpack.BannerPlugin({
    entryOnly: true,
    test: /\.js/,
    banner: `Oh, attention, vous êtes devant du code minimifié !
Ce n'est pas pour cacher du code malveillant, c'est uniquement pour réduire le poids de l'extension.

Fichier original : https://github.com/Kocal/Solary/blob/${gitBranchOrTag}/src/[name].ts`,
  }));
}

module.exports = Encore.getWebpackConfig();
