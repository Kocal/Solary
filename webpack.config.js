const childProcess = require('child_process');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { version } = require('./package.json');

const config = {
  mode: 'development',
  context: `${__dirname}/src`,
  entry: {
    background: './background.ts',
    'popup/popup': './popup/popup.ts',
    'options/options': './options/options.ts',
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue'],
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      chunks: 'all',
      name: 'vendor',
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loaders: 'vue-loader',
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader',
          fallback: 'vue-style-loader',
        }),
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader!sass-loader',
          fallback: 'vue-style-loader',
        }),
      },
      {
        test: /\.(png|jpg|gif|svg|ico)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?emitFile=false',
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new ExtractTextPlugin({
      filename: '[name].css',
    }),
    new CopyWebpackPlugin([
      { from: 'icons', to: 'icons', ignore: ['icon.xcf'] },
      { from: 'popup/popup.html', to: 'popup/popup.html' },
      { from: 'options/options.html', to: 'options/options.html' },
      {
        from: 'manifest.json',
        to: 'manifest.json',
        transform(content) {
          const contentJson = JSON.parse(content);
          contentJson.version = version;

          if (config.mode === 'development') {
            contentJson['content_security_policy'] = "script-src 'self' 'unsafe-eval'; object-src 'self'";
          }

          return JSON.stringify(contentJson, null, 2);
        },
      },
    ]),
    new WebpackShellPlugin({
      onBuildEnd: ['node scripts/remove-evals.js'],
    }),
  ],
};

if (process.env.NODE_ENV === 'production') {
  const exec = command =>
    childProcess
      .execSync(command)
      .toString()
      .trim();

  const gitRevision = exec('git rev-parse --abbrev-ref HEAD');
  const gitBranchOrTag = gitRevision === 'HEAD' ? exec('git describe --tags --abbrev=0') : gitRevision;

  config.mode = 'production';
  config.devtool = '#cheap-module-source-map';

  config.plugins = (config.plugins || []).concat([
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new webpack.BannerPlugin({
      entryOnly: true,
      test: /\.js/,
      banner: `Oh, attention, vous êtes devant du code minimifié !
Ce n'est pas pour cacher du code malveillant, c'est uniquement pour réduire le poids de l'extension.

Fichier original : https://github.com/Kocal/Solary/blob/${gitBranchOrTag}/src/[name].ts`,
    }),
  ]);
}

module.exports = config;
