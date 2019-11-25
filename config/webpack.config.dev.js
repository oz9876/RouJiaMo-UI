const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({size: 4});
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const publicPath = '/';
const publicUrl = '';
const env = getClientEnvironment(publicUrl);

const fs = require('fs');
const useTypeScript = fs.existsSync(paths.appTsConfig);

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: [
    'react-hot-loader/patch', // 每次热更新组件里的state被保存下来
    require.resolve('react-dev-utils/webpackHotDevClient'),
    paths.appIndexJs,
  ],
  output: {
    pathinfo: true,//捆绑包中有关模块的信息的注释
    filename: 'bundle.js',
    chunkFilename: '[name].chunk.js',
    publicPath: publicPath,
    //模板字符串名称
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    modules: ['node_modules', paths.appNodeModules].concat(
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    // extensions: paths.moduleFileExtensions
    //         .map(ext => `.${ext}`)
    //         .filter(ext => useTypeScript || !ext.includes('ts')),
    // extensions: ['.js', '.jsx','.json', '.ts' ],
    extensions: ['.ts', '.tsx', '.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],

    alias: {
      'common': path.resolve(__dirname, '../src/common'),
      'components': path.resolve(__dirname, '../src/components'),
      'containers': path.resolve(__dirname, '../src/containers'),
      'images': path.resolve(__dirname, '../src/assets/images'),
      'styles': path.resolve(__dirname, '../src/assets/styles')
      //创建模块别名
    },
    plugins: [
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        enforce: 'pre',
        // use: [
        //   {
        //     options: {
        //       formatter: eslintFormatter,
        //       eslintPath: require.resolve('eslint'),
        //     },
        //     loader: require.resolve('eslint-loader'),
        //   },
        // ],
        include: paths.appSrc,
      },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 1000,
              name: 'static/images/[name].[hash:8].[ext]',
            },
          },
          // {
          //   test: /\.ts$/,
          //   loader: 'tslint-loader',
          //   exclude: /node_modules/,
          //   enforce: 'pre',
          // },
          {
            test: /\.(tsx|ts)$/,
            exclude: /node_modules/,
            use:[
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true,
                  // presets: [
                  //   "react",
                  //   [
                  //     "es2015",
                  //     {
                  //       "modules": false
                  //     }
                  //   ],
                  //   "es2016"
                  // ]
                }
              },
              {
                loader: 'ts-loader'
              }
            ]
          },
          {
            test: /\.(js|jsx|mjs)$/,
            include: paths.appSrc,
            loader: 'happypack/loader?id=1'
          },
          {
            test: /\.(css)$/,
            loader: 'happypack/loader?id=2'
          },
          {
            test: /\.(less)$/,
            loader: 'happypack/loader?id=3'
          },
          {
            exclude: [/\.(js|jsx|mjs|ts)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/css/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HappyPack({
      id: '1',
      threadPool : happyThreadPool,
      threads : 4,
      loaders: [
        'babel-loader',
        {
          loader: 'babel-loader',
          options: {
            // plugins: ['react-hot-loader/babel']
          },
        },
        // 'ts-loader'
      ]
    }),
    new HappyPack({
      id: '2',
      threadPool : happyThreadPool,
      threads : 4,
      loaders : [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            localIdentName: '[local]--[hash:base64:5]'
          }
        },
        'postcss-loader'
      ]
    }),
    new HappyPack({
      id: '3',
      threadPool: happyThreadPool,
      threads: 4,
      loaders: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            localIdentName: '[local]--[hash:base64:5]'
          }
        },
        'postcss-loader',
        'less-loader'
      ]
    }),
    new HtmlWebpackPlugin({inject: true, hash: true, template: paths.appHtml}),
    new ProgressBarPlugin(),
    new webpack.NamedModulesPlugin(), // 用于启动HMR时可以显示模块的相对路径
    new webpack.DefinePlugin(env.stringified),
    new webpack.HotModuleReplacementPlugin(), //hot module replacement 启动模块热替换的插件
    new CaseSensitivePathsPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  // 配置如何展示性能提示。如果一个资源超过 250kb，webpack 会对此输出一个警告
  performance: {
    hints: false,
  },
};
