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

import { __DEV__, projectName, resolvePath, projectRoot, hmrPath } from '../env';

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
    context: projectRoot,
    entry: ['react-hot-loader/patch', resolvePath(projectRoot, './src/index.tsx')],
    output: {
        publicPath: '/',
        path: resolvePath(projectRoot, './dist'),
        filename: 'js/[name]-[hash].bundle.js',
        hashSalt: projectName || 'react typescript boilerplate',
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
            banner: `/** @preserve Powered by react-typescript-boilerplate (https://github.com/tjx666/react-typescript-boilerplate) */`,
        }),
        new FriendlyErrorsPlugin(),
        // new WebpackBuildNotifierPlugin({ suppressSuccess: true }),
        new CaseSensitivePathsPlugin(),
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: projectRoot,
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            minify: __DEV__ ? false : htmlMinifyOptions,
            template: resolvePath(projectRoot, './public/index.html'),
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
                    to: resolvePath(projectRoot, './dist'),
                    toType: 'dir',
                    ignore: ['index.html'],
                },
            ],
            { context: resolvePath(projectRoot, './public') },
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
                            limit: 8192,
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
    (commonConfig.entry as string[]).unshift(`webpack-hot-middleware/client?path=${hmrPath}`);
}

export default commonConfig;
