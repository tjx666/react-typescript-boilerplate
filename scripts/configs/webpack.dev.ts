import { HotModuleReplacementPlugin, NamedModulesPlugin } from 'webpack';
import merge from 'webpack-merge';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import commonConfig from './webpack.common';
import { resolvePath, projectRoot } from '../env';

const devConfig = merge(commonConfig, {
    mode: 'development',
    devtool: 'eval-source-map',
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            memoryLimit: 1024,
            tsconfig: resolvePath(projectRoot, './src/tsconfig.json'),
        }),
        new HotModuleReplacementPlugin(),
        new NamedModulesPlugin(),
    ],
});

export default devConfig;
