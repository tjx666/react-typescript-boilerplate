const { resolve } = require;

module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: ['plugin:react/recommended', 'airbnb', 'airbnb/hooks', 'prettier'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    settings: {
        'import/resolver': {
            node: {
                // 指定 eslint-plugin-import 解析的后缀名
                extensions: ['.ts', '.tsx', '.js', '.json'],
            },
            // 配置 eslint-import-resolver-typescript 读取 tsconfig.json 的路径
            typescript: {
                // directory: [resolve('./src/tsconfig.json'), resolve('./scripts/tsconfig.json')],
            },
        },
    },
    plugins: ['react', '@typescript-eslint'],
    rules: {
        'import/extensions': [
            2,
            'ignorePackages',
            {
                ts: 'never',
                tsx: 'never',
                json: 'never',
                js: 'never',
            },
        ],

        '@typescript-eslint/no-useless-constructor': 2,

        'react/jsx-filename-extension': [2, { extensions: ['.tsx'] }],
        'react/jsx-indent-props': [2, 4],
        'react/jsx-indent': [2, 4],

        'func-names': 0,
        'lines-between-class-members': 0,
        'no-console': 0,
        'no-empty': 1,
        'no-param-reassign': 1,
        'no-plusplus': 0,
        'no-unused-expressions': 0,
        'no-unused-vars': 1,
        'no-useless-constructor': 0,
    },
    overrides: [
        {
            files: ['**/*.d.ts'],
            rules: {
                'import/no-duplicates': 0,
                'max-classes-per-file': 0,
            },
        },
        {
            files: ['scripts/**/*.ts'],
            rules: {
                'import/no-extraneous-dependencies': 0,
            },
        },
    ],
};
