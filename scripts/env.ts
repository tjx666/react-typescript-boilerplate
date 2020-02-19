/* eslint-disable import/newline-after-import */
import { resolve } from 'path';
import { argv } from 'yargs';

const __DEV__ = process.env.NODE_ENV !== 'production';
const isAnalyze = !!argv.analyze;
const projectName: string | undefined = require('../package.json').name;
const projectRoot = resolve(__dirname, '../');
const hmrPath = '/__webpack_hmr';

export { __DEV__, isAnalyze, projectName, projectRoot, resolve as resolvePath, hmrPath };
