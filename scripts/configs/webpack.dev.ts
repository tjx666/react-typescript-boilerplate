import { resolve } from 'path';
import merge from 'webpack-merge';
import { HotModuleReplacementPlugin, NamedModulesPlugin } from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import commonConfig from './webpack.common';
import { PROJECT_ROOT } from '../utils/constants';

const devConfig = merge(commonConfig, {
    mode: 'development',
    // 觉得打包速度慢可以考虑改成 cheap-eval-source-map，但是这种 sourceMap 不会显示列号
    // 如果觉得还可以容忍更慢的非 eval 类型的 sourceMap，可以搭配 error-overlay-webpack-plugin 使用
    devtool: 'eval-source-map',
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            memoryLimit: 1024,
            tsconfig: resolve(PROJECT_ROOT, './src/tsconfig.json'),
        }),
        new HotModuleReplacementPlugin(),
        // 会在浏览器控制台显示每次修改的模块
        new NamedModulesPlugin(),
    ],
});

export default devConfig;
