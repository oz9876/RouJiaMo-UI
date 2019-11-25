

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: 4 });
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CopyWebpackPlugin    = require('copy-webpack-plugin')
const IncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');             

const publicPath = paths.servedPath;
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

const fs = require('fs');
const useTypeScript = fs.existsSync(paths.appTsConfig);

if (env.stringified['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

module.exports = {
  mode: 'production',
  bail: true,
  entry: [paths.appIndexJs],
  output: {
    path: paths.appBuild,
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath: './',
    devtoolModuleFilenameTemplate: info =>
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/'),
  },
  resolve: {
    modules: ['node_modules', paths.appNodeModules].concat(
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    // extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
    extensions: paths.moduleFileExtensions
            .map(ext => `.${ext}`)
            .filter(ext => useTypeScript || !ext.includes('ts')),
    alias: {
      'common': path.resolve(__dirname, '../src/common'),
      'components': path.resolve(__dirname, '../src/components'),
      'containers': path.resolve(__dirname, '../src/containers'),
      'reducer': path.resolve(__dirname, '../src/redux/modules'),
      'images': path.resolve(__dirname, '../src/assets/images'),
      'styles': path.resolve(__dirname, '../src/assets/styles')
    },
    plugins: [
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
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
            test: /\.(tsx)$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
          },
          {
            test: /\.(js|jsx|mjs)$/,
            include: paths.appSrc,
            loader: 'happypack/loader?id=1',
            options: {
              compact: true,
            },
          },
          {
            test: /\.(css)$/,
            loader: [
              MiniCssExtractPlugin.loader,
              'happypack/loader?id=2'
            ]
          },
          {
            test: /\.(less)$/,
            loader: [
              MiniCssExtractPlugin.loader,
              'happypack/loader?id=3'
            ]
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/css/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          // reuseExistingChunk: true
        }
      }
    },
    // webpack4.0后, 打包上线无 console和debugger的写法;
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true
          }
        }
      })
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name]-[contenthash].min.css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.min.css'
    }),
    new webpack.LoaderOptionsPlugin({ // 打包压缩出来mini版
      minimize: true,
      debug: false
    }),
    new HappyPack({
      id: '1',
      threadPool : happyThreadPool,
      use: ['babel-loader'],
      threads: 4
    }),
    new HappyPack({
      id: '2',
      threadPool: happyThreadPool,
      threads: 4,
      loaders: [
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
    new ProgressBarPlugin(),
    new webpack.DefinePlugin(env.stringified),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // copy插件
    new CopyWebpackPlugin([
      { 
        from : path.join(__dirname, '../dll'), 
        to : path.join(__dirname, '../build', 'dll') 
      },
      { 
        from: path.join(__dirname, '../third-sdk'), 
        to: path.join(__dirname, '../build', 'third-sdk')
      }
    ]),
    // 把未打包的样式和脚本也想自动插入到html中
    new IncludeAssetsPlugin({
      assets: [{
        path    : 'dll',
        glob    : '*.js',
        globPath: path.join(__dirname, '../dll')
      }],
      append: false
    }),
    // 把预先打包好的公共di3方库插入 打包后项目里
    new webpack.DllReferencePlugin({
      context : __dirname,
      manifest: path.resolve(__dirname, '../dll', 'manifest.json')
    })
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: {
    hints: false,
  },
};
