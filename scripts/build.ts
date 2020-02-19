import webpack from 'webpack';

import prodConfig from './configs/webpack.prod';
import { isAnalyze } from './env';

const compiler = webpack(prodConfig);

compiler.run((error, stats) => {
    if (error) {
        console.error(error);
        return;
    }

    const prodStatsOpts = {
        preset: 'normal',
        modules: isAnalyze,
        colors: true,
    };

    console.log(stats.toString(prodStatsOpts));
});
