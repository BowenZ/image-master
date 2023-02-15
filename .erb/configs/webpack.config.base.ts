/**
 * Base webpack config used across other specific configs
 */

import webpack from 'webpack';
import path from 'path';
import WindiCSSWebpackPlugin from 'windicss-webpack-plugin';
import webpackPaths from './webpack.paths';
import { dependencies as externals } from '../../release/app/package.json';

const configuration: webpack.Configuration = {
  externals: [...Object.keys(externals || {})],

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // Remove this line to enable type checking in webpack builds
            transpileOnly: true,
            compilerOptions: {
              module: 'esnext',
            },
          },
        },
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: 'commonjs2',
    },
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
    alias: {
      '@': path.resolve(__dirname, '../../src'),
      '#': path.resolve(__dirname, '../../assets'),
      main: path.resolve(__dirname, '../../src/main'),
      renderer: path.resolve(__dirname, '../../src/renderer'),
    },
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
    new WindiCSSWebpackPlugin(),
  ],
};

export default configuration;
