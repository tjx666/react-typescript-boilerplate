import chalk from 'chalk';
import logSymbols from 'log-symbols';
import webpack, { Compiler } from 'webpack';
import express, { Express } from 'express';

// 中间件
import historyFallback from 'connect-history-api-fallback';
import cors from 'cors';
import proxyMiddleware from './middlewares/proxyMiddleware';
import webpackMiddleware from './middlewares/webpackMiddleware';

import devConfig from './configs/webpack.dev';
import { HOST, DEFAULT_PORT } from './utils/constants';
import getPort from './utils/getPort';
import openBrowser from './utils/openBrowser';

/**
 * 配置中间件
 */
function setupMiddlewares(compiler: Compiler, server: Express) {
    // 设置代理
    proxyMiddleware(server);

    // 使用 browserRouter 时，需要重定向所有 html 页面到首页
    server.use(historyFallback());

    // 开发 chrome 扩展的时候可能需要开启跨域，参考：https://juejin.im/post/5e2027096fb9a02fe971f6b8
    server.use(cors());

    // webpack 相关中间件
    server.use(webpackMiddleware(compiler));
}

async function start() {
    const PORT = await getPort(HOST, DEFAULT_PORT);
    const address = `http://${HOST}:${PORT}`;

    // 加载 webpack 配置，获取 compiler
    const compiler = webpack(devConfig);

    const devServer = express();
    setupMiddlewares(compiler, devServer);
    openBrowser(compiler, address);

    const httpServer = devServer.listen(PORT, HOST, err => {
        if (err) {
            console.error(err);
            return;
        }

        // logSymbols.success 在 windows 平台渲染为 √ ，支持的平台会显示 ✔
        console.log(
            `DevServer is running at ${chalk.magenta.underline(address)} ${logSymbols.success}`,
        );
    });

    // 我们监听了 node 信号，所以使用 cross-env-shell 而不是 cross-env
    // 参考：https://github.com/kentcdodds/cross-env#cross-env-vs-cross-env-shell
    process.on('SIGINT', () => {
        // 先关闭 devServer
        httpServer.close();
        // 在 ctrl + c 的时候随机输出 'See you again' 和 'Goodbye'
        console.log(
            chalk.greenBright.bold(`\n${Math.random() > 0.5 ? 'See you again' : 'Goodbye'}!`),
        );
    });
}

// 写过 python 的人应该不会陌生这种写法
// 判断这个模块是不是被直接运行的
if (require.main === module) {
    start();
}
