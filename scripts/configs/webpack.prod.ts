import { resolve } from 'path';
import merge from 'webpack-merge';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CompressionPlugin from 'compression-webpack-plugin';
import SizePlugin from 'size-plugin';

import commonConfig from './webpack.common';
import { ENABLE_ANALYZE, PROJECT_ROOT } from '../utils/constants';

const mergedConfig = merge(commonConfig, {
    mode: 'production',
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            memoryLimit: 1024 * 2,
            tsconfig: resolve(PROJECT_ROOT, './src/tsconfig.json'),
            measureCompilationTime: true,
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[id].[contenthash].css',
            ignoreOrder: false,
        }),
        new CompressionPlugin({ cache: true }),
        new SizePlugin({ writeFile: false }),
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({ extractComments: false }), new OptimizeCSSAssetsPlugin()],
    },
});

const smp = new SpeedMeasurePlugin();
const prodConfig = smp.wrap(mergedConfig);

if (ENABLE_ANALYZE) {
    mergedConfig.plugins!.push(new BundleAnalyzerPlugin());
}

export default prodConfig;
