import { ProxyTable } from '../typings/devServer';

const proxyTable: ProxyTable = {
    // 示例配置
    '/path_to_be_proxy': { target: 'http://target.domain.com', changeOrigin: true },
};

export default proxyTable;
