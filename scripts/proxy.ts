import { createProxyMiddleware } from 'http-proxy-middleware';
import chalk from 'chalk';

import { Express } from 'express';
import { Options } from 'http-proxy-middleware/dist/types';

interface ProxyTable {
    [path: string]: Options;
}

const proxyTable: ProxyTable = {
    // 示例配置
    '/path_to_be_proxy': { target: 'http://target.domain.com', changeOrigin: true },
};

// 修饰链接的辅助函数, 修改颜色并添加下划线
function renderLink(str: string) {
    return chalk.magenta.underline(str);
}

function proxy(server: Express) {
    Object.entries(proxyTable).forEach(([path, options]) => {
        const from = path;
        const to = options.target as string;
        console.log(`proxy ${renderLink(from)} ${chalk.green('->')} ${renderLink(to)}`);

        // eslint-disable-next-line no-param-reassign
        if (!options.logLevel) options.logLevel = 'warn';
        server.use(path, createProxyMiddleware(options));

        // 如果需要更灵活的定义方式，请在下面直接使用 server.use(path, proxyMiddleware(options)) 定义
    });
    process.stdout.write('\n');
}

export default proxy;
