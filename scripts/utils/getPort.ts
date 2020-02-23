import _getPort from 'get-port';

/**
 * 获取可用端口，被占用后加一
 */
export default async function getPort(host: string, port: number): Promise<number> {
    const result = await _getPort({ host, port });

    if (result === port) {
        return result;
    }

    return getPort(host, port + 1);
}
