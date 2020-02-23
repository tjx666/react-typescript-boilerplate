import chalk from 'chalk';
import logSymbols from 'log-symbols';
import webpack from 'webpack';
import express from 'express';

import devConfig from './configs/webpack.dev';
import { HOST, DEFAULT_PORT } from './utils/constants';
import getPort from './utils/getPort';
import setupMiddlewares from './middlewares';
import openBrowser from './utils/openBrowser';

async function start() {
    const PORT = await getPort(HOST, DEFAULT_PORT);
    const address = `http://${HOST}:${PORT}`;

    // 加载 webpack 配置，获取 compiler
    const compiler = webpack(devConfig);

    const devServer = express();
    setupMiddlewares(devServer, compiler);
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
