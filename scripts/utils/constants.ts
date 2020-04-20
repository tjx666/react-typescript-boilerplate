import path from 'path';
import { argv } from 'yargs';

const __DEV__ = process.env.NODE_ENV !== 'production';
const ENABLE_ANALYZE = !!argv.analyze;
const ENABLE_OPEN = argv.open as true | string;

const HOST = '127.0.0.1';
const DEFAULT_PORT = 3000;
const COPYRIGHT = `/** @preserve Powered by react-typescript-boilerplate (https://github.com/tjx666/react-typescript-boilerplate) */`;

const PROJECT_ROOT = path.resolve(__dirname, '../../');
const PROJECT_NAME = path.parse(PROJECT_ROOT).name;
const HMR_PATH = '/__webpack_hmr';

export {
    __DEV__,
    ENABLE_ANALYZE,
    ENABLE_OPEN,
    HOST,
    DEFAULT_PORT,
    COPYRIGHT,
    PROJECT_NAME,
    PROJECT_ROOT,
    HMR_PATH,
};
