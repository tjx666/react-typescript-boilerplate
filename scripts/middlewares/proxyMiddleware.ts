import { Express } from 'express';
import chalk from 'chalk';
import { createProxyMiddleware } from 'http-proxy-middleware';

import proxyTable from '../configs/proxy';

function link(str: string) {
    return chalk.magenta.underline(str);
}

export default function proxyMiddleware(server: Express) {
    Object.entries(proxyTable).forEach(([path, options]) => {
        const from = path;
        const to = options.target as string;
        console.log(`proxy ${link(from)} ${chalk.green('->')} ${link(to)}`);

        if (!options.logLevel) options.logLevel = 'warn';
        server.use(path, createProxyMiddleware(options));

        // 如果需要更灵活的定义方式
        // 请在下面直接使用 server.use(path, proxyMiddleware(options)) 定义
    });
    process.stdout.write('\n');
}
