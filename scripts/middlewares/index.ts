import { Compiler } from 'webpack';
import { Express } from 'express';

// 中间件
import historyFallback from 'connect-history-api-fallback';
import cors from 'cors';
import proxyMiddleware from './proxyMiddleware';
import webpackMiddleware from './webpackMiddleware';

/**
 * 配置中间件
 */
export default function setupMiddlewares(server: Express, compiler: Compiler): void {
    // 设置代理
    proxyMiddleware(server);

    // 使用 browserRouter 时，需要重定向所有 html 页面到首页
    server.use(historyFallback());

    // 开发 chrome 扩展的时候可能需要开启跨域，参考：https://juejin.im/post/5e2027096fb9a02fe971f6b8
    server.use(cors());

    // webpack 相关中间件
    server.use(webpackMiddleware(compiler));
}
