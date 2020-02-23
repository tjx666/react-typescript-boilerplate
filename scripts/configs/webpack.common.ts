import { resolve } from 'path';
import { BannerPlugin, Configuration } from 'webpack';
import WebpackBar from 'webpackbar';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
// import WebpackBuildNotifierPlugin from 'webpack-build-notifier';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Options as HtmlMinifierOptions } from 'html-minifier';
import CopyPlugin from 'copy-webpack-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import { loader as MiniCssExtractLoader } from 'mini-css-extract-plugin';

import { __DEV__, COPYRIGHT, PROJECT_NAME, PROJECT_ROOT, HMR_PATH } from '../utils/constants';

function getCssLoaders(importLoaders: number) {
    return [
        __DEV__ ? 'style-loader' : MiniCssExtractLoader,
        {
            loader: 'css-loader',
            options: {
                modules: false,
                sourceMap: true,
                importLoaders,
            },
        },
        {
            loader: 'postcss-loader',
            options: { sourceMap: true },
        },
    ];
}

const htmlMinifyOptions: HtmlMinifierOptions = {
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
    useShortDoctype: true,
};

const commonConfig: Configuration = {
    context: PROJECT_ROOT,
    entry: ['react-hot-loader/patch', resolve(PROJECT_ROOT, './src/index.tsx')],
    output: {
        publicPath: '/',
        path: resolve(PROJECT_ROOT, './dist'),
        filename: 'js/[name]-[hash].bundle.js',
        hashSalt: PROJECT_NAME,
    },
    resolve: {
        // 指定 require 模块尝试使用的后缀名
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
        },
    },
    plugins: [
        new WebpackBar({
            name: 'react-typescript-boilerplate',
            // react 蓝
            color: '#61dafb',
        }),
        new BannerPlugin({
            raw: true,
            banner: COPYRIGHT,
        }),
        new FriendlyErrorsPlugin(),
        // new WebpackBuildNotifierPlugin({ suppressSuccess: true }),
        new CaseSensitivePathsPlugin(),
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: PROJECT_ROOT,
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            // HtmlWebpackPlugin 会调用 HtmlMinifier 对 HTMl 文件进行压缩
            // 只在生产环境压缩
            minify: __DEV__ ? false : htmlMinifyOptions,
            template: resolve(PROJECT_ROOT, './public/index.html'),
            templateParameters: (...args: any[]) => {
                const [compilation, assets, assetTags, options] = args;
                const rawPublicPath = commonConfig.output!.publicPath!;
                return {
                    compilation,
                    webpackConfig: compilation.options,
                    htmlWebpackPlugin: {
                        tags: assetTags,
                        files: assets,
                        options,
                    },
                    PUBLIC_PATH: rawPublicPath.endsWith('/')
                        ? rawPublicPath.slice(0, -1)
                        : rawPublicPath,
                };
            },
        }),
        new CopyPlugin(
            [
                {
                    from: '*',
                    to: resolve(PROJECT_ROOT, './dist'),
                    toType: 'dir',
                    ignore: ['index.html'],
                },
            ],
            { context: resolve(PROJECT_ROOT, './public') },
        ),
        new HardSourceWebpackPlugin({ info: { mode: 'none', level: 'warn' } }),
    ],
    module: {
        rules: [
            {
                test: /\.(tsx?|js)$/,
                loader: 'babel-loader',
                options: { cacheDirectory: true },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: getCssLoaders(0),
            },
            {
                test: /\.less$/,
                use: [
                    ...getCssLoaders(2),
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    ...getCssLoaders(2),
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true },
                    },
                ],
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // 低于 10 k
                            limit: 100 * 1024,
                            name: '[name].[contenthash].[ext]',
                            outputPath: 'images',
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|woff|woff2|eot|otf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name]-[contenthash].[ext]',
                            outputPath: 'fonts',
                        },
                    },
                ],
            },
        ],
    },
};

if (__DEV__) {
    (commonConfig.entry as string[]).unshift(`webpack-hot-middleware/client?path=${HMR_PATH}`);
}

export default commonConfig;
