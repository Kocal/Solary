const childProcess = require('child_process');
const webpack = require('webpack');
const ejs = require('ejs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
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
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyWebpackPlugin([
      { from: 'icons', to: 'icons', ignore: ['icon.xcf'] },
      { from: 'popup/popup.html', to: 'popup/popup.html', transform: transformHtml },
      { from: 'options/options.html', to: 'options/options.html', transform: transformHtml },
      {
        from: 'manifest.json',
        to: 'manifest.json',
        transform(content) {
          const contentJson = JSON.parse(content);
          contentJson.version = version;

          if (config.mode === 'development') {
            contentJson['content_security_policy'] =
              "script-src 'self' 'unsafe-eval' http://localhost:8098; object-src 'self'";
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

function transformHtml(content) {
  return ejs.render(content.toString(), {
    ...process.env,
  });
}

module.exports = config;
