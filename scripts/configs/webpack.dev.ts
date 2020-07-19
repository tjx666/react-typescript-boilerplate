import { resolve } from 'path';
import { merge } from 'webpack-merge';
import { HotModuleReplacementPlugin } from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import commonConfig from './webpack.common';
import { PROJECT_ROOT } from '../utils/constants';

const devConfig = merge(commonConfig, {
    mode: 'development',
    // 如果觉得还可以容忍更慢的非 eval 类型的 sourceMap，可以搭配 error-overlay-webpack-plugin 使用
    // 需要显示列号可以切换成 eval-source-map
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                memoryLimit: 1024,
                configFile: resolve(PROJECT_ROOT, './src/tsconfig.json'),
            },
        }),
        new HotModuleReplacementPlugin(),
    ],
});

export default devConfig;
