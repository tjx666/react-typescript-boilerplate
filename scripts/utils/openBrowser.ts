import open from 'open';
import { Compiler, Stats } from 'webpack';

import { ENABLE_OPEN } from './constants';

/**
 * 一个 webpack 插件，在第一次编译成功时打开浏览器访问 devServer 首页
 */
export default function openBrowser(compiler: Compiler, address: string) {
    if (ENABLE_OPEN) {
        let hadOpened = false;
        compiler.hooks.done.tap('open-browser-plugin', async (stats: Stats) => {
            if (!hadOpened && !stats.hasErrors()) {
                await open(address);
                hadOpened = true;
            }
        });
    }
}
