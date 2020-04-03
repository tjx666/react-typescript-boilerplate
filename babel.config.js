const envPreset = [
    '@babel/preset-env',
    {
        // 只导入需要的 polyfill
        useBuiltIns: 'usage',
        // 指定 corjs 版本
        corejs: 3,
        // 禁用模块化方案转换
        modules: false,
    },
];

module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['@babel/preset-typescript', envPreset],
        plugins: [
            '@babel/plugin-transform-runtime',
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-optional-chaining',
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
        ],
        env: {
            development: {
                presets: [['@babel/preset-react', { development: true }]],
                plugins: ['react-hot-loader/babel'],
            },
            production: {
                presets: ['@babel/preset-react'],
                plugins: [
                    'babel-plugin-dev-expression',
                    '@babel/plugin-transform-react-constant-elements',
                    '@babel/plugin-transform-react-inline-elements',
                ],
            },
        },
    };
};
