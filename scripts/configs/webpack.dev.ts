import { resolve } from 'path';
import merge from 'webpack-merge';
import { HotModuleReplacementPlugin, NamedModulesPlugin } from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import commonConfig from './webpack.common';
import { PROJECT_ROOT } from '../utils/constants';

const devConfig = merge(commonConfig, {
    mode: 'development',
    devtool: 'eval-source-map',
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            memoryLimit: 1024,
            tsconfig: resolve(PROJECT_ROOT, './src/tsconfig.json'),
        }),
        new HotModuleReplacementPlugin(),
        new NamedModulesPlugin(),
    ],
});

export default devConfig;
