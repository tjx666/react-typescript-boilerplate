import { Compiler } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import devConfig from '../configs/webpack.dev';
import { HMR_PATH } from '../utils/constants';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function webpackMiddleware(compiler: Compiler) {
    const publicPath = devConfig.output!.publicPath!;

    const devMiddlewareOptions: webpackDevMiddleware.Options = {
        // 保持和 webpack 中配置一致
        publicPath,
        // 只在发生错误或有新的编译时输出
        stats: 'minimal',
        // 需要输出文件到磁盘可以开启
        // writeToDisk: true
    };

    const hotMiddlewareOptions: webpackHotMiddleware.MiddlewareOptions = {
        // sse 路由
        path: HMR_PATH,
    };

    return [
        webpackDevMiddleware(compiler, devMiddlewareOptions),
        webpackHotMiddleware(compiler, hotMiddlewareOptions),
    ];
}
