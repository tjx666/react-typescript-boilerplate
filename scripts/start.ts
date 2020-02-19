import chalk from 'chalk';
import getPort from 'get-port';
import logSymbols from 'log-symbols';
import open from 'open';
import { argv } from 'yargs';
import express, { Express } from 'express';
import webpack, { Compiler, Stats } from 'webpack';
import historyFallback from 'connect-history-api-fallback';
import cors from 'cors';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import proxy from './proxy';
import devConfig from './configs/webpack.dev';
import { hmrPath } from './env';

function openBrowser(compiler: Compiler, address: string) {
    if (argv.open) {
        let hadOpened = false;
        // 第一次编译成功时打开浏览器
        compiler.hooks.done.tap('open-browser-plugin', async (stats: Stats) => {
            if (!hadOpened && !stats.hasErrors()) {
                await open(address);
                hadOpened = true;
            }
        });
    }
}

function setupMiddlewares(compiler: Compiler, server: Express) {
    const publicPath = devConfig.output!.publicPath!;

    // 设置代理
    proxy(server);

    // 使用 browserRouter 需要重定向所有 html 页面到首页
    server.use(historyFallback());

    // 开发 chrome 扩展的时候可能需要开启跨域，参考：https://juejin.im/post/5e2027096fb9a02fe971f6b8
    server.use(cors());

    const devMiddlewareOptions: webpackDevMiddleware.Options = {
        // 保持和 webpack 中配置一致
        publicPath,
        // 只在发生错误或有新的编译时输出
        stats: 'minimal',
        // 需要输出文件到磁盘可以开启
        // writeToDisk: true
    };
    server.use(webpackDevMiddleware(compiler, devMiddlewareOptions));

    const hotMiddlewareOptions: webpackHotMiddleware.Options = {
        // sse 路由
        path: hmrPath,
        // 编译出错会在网页中显示出错信息遮罩
        overlay: true,
        // webpack 卡住自动刷新页面
        reload: true,
    };
    server.use(webpackHotMiddleware(compiler, hotMiddlewareOptions));
}

async function start() {
    const HOST = '127.0.0.1';
    // 4个备选端口，都被占用会使用随机端口
    const PORT = await getPort({ port: [3000, 4000, 8080, 8888] });
    const address = `http://${HOST}:${PORT}`;

    // 加载 webpack 配置
    const compiler = webpack(devConfig);
    openBrowser(compiler, address);

    const devServer = express();
    setupMiddlewares(compiler, devServer);

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
// require.main === module 判断这个模块是不是被直接运行的
if (require.main === module) {
    start();
}
