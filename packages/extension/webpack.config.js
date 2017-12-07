const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackUglifyPlugin = require('uglifyjs-webpack-plugin');
const { version } = require('../../lerna.json');

const config = {
  context: `${__dirname}/src`,
  entry: {
    background: './background.ts',
    'popup/popup': './popup/popup.ts',
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue'],
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loaders: 'vue-loader',
        options: {
          loaders: {
            scss: ExtractTextPlugin.extract({
              use: 'css-loader!sass-loader',
              fallback: 'vue-style-loader',
            }),
            sass: ExtractTextPlugin.extract({
              use: 'css-loader!sass-loader?indentedSyntax',
              fallback: 'vue-style-loader',
            }),
          },
        },
      },
      // {
      //   test: /\.js$/,
      //   loader: 'babel-loader',
      //   exclude: /node_modules/,
      // },
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
          fallback: 'vue-loader',
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
    new ExtractTextPlugin({
      filename: '[name].css',
    }),
    new CopyWebpackPlugin([
      { from: 'icons', to: 'icons' },
      { from: 'popup/popup.html', to: 'popup/popup.html' },
      {
        from: 'manifest.json',
        to: 'manifest.json',
        transform(content) {
          const contentJson = JSON.parse(content);
          contentJson.version = version;

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
  config.devtool = '#cheap-module-source-map';

  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new WebpackUglifyPlugin({
      parallel: true,
      sourceMap: true,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ]);
}

module.exports = config;
