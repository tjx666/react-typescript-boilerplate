const { resolve } = require('path');

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
                directory: [resolve(__dirname, './src/tsconfig.json'), resolve(__dirname, './scripts/tsconfig.json')],
            },
        },
    },
    plugins: ['react', '@typescript-eslint'],
    rules: {
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                ts: 'never',
                tsx: 'never',
                json: 'never',
                js: 'never',
            },
        ],

        '@typescript-eslint/no-useless-constructor': 'error',

        'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-indent': ['error', 4],

        'func-names': 'off',
        'lines-between-class-members': 'off',
        'no-console': 'off',
        'no-empty': 'warn',
        'no-param-reassign': 'warn',
        'no-plusplus': 'off',
        'no-unused-expressions': 'off',
        'no-unused-vars': 'warn',
        'no-useless-constructor': 'off',
    },
    overrides: [
        {
            files: ['**/*.d.ts'],
            rules: {
                'import/no-duplicates': 'off',
                'max-classes-per-file': 'off',
            },
        },
        {
            files: ['scripts/**/*.ts'],
            rules: {
                'import/no-extraneous-dependencies': 'off',
            },
        },
    ],
};
