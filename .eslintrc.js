const { resolve } = require;

const OFF = 0;
const ERROR = 2;

module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: [
        'airbnb',
        'airbnb/hooks',
        'plugin:eslint-comments/recommended',
        'plugin:import/typescript',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:unicorn/recommended',
        'plugin:promise/recommended',
        'prettier',
        'prettier/react',
        'prettier/@typescript-eslint',
    ],
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
                extensions: ['.ts', '.tsx', '.js', '.json'],
            },
            typescript: {
                directory: [resolve('./src/tsconfig.json'), resolve('./scripts/tsconfig.json')],
            },
        },
    },
    plugins: ['react', '@typescript-eslint', 'unicorn', 'promise'],
    rules: {
        'eslint-comments/disable-enable-pair': [ERROR, { allowWholeFile: true }],

        'import/extensions': [
            ERROR,
            'ignorePackages',
            {
                ts: 'never',
                tsx: 'never',
                json: 'never',
                js: 'never',
            },
        ],

        'unicorn/prevent-abbreviations': OFF,
        'unicorn/filename-case': [
            'error',
            {
                cases: {
                    // 中划线
                    kebabCase: false,
                    // 小驼峰
                    camelCase: true,
                    // 下划线
                    snakeCase: false,
                    // 大驼峰
                    pascalCase: true,
                },
            },
        ],
        'unicorn/no-process-exit': OFF,

        '@typescript-eslint/explicit-function-return-type': OFF,
        '@typescript-eslint/no-explicit-any': OFF,
        '@typescript-eslint/no-non-null-assertion': OFF,
        '@typescript-eslint/no-useless-constructor': ERROR,

        'react/jsx-filename-extension': [ERROR, { extensions: ['.tsx'] }],
        'react/jsx-indent-props': [ERROR, 4],
        'react/jsx-indent': [ERROR, 4],

        'func-names': OFF,
        'lines-between-class-members': OFF,
        'max-classes-per-file': OFF,
        'no-console': OFF,
        'no-empty': OFF,
        'no-param-reassign': OFF,
        'no-plusplus': OFF,
        'no-underscore-dangle': OFF,
        'no-unused-expressions': OFF,
        'no-useless-constructor': OFF,
    },
    overrides: [
        {
            files: ['**/*.d.ts'],
            rules: {
                'import/no-duplicates': OFF,
            },
        },
        {
            files: ['scripts/**/*.ts'],
            rules: {
                'import/no-extraneous-dependencies': OFF,
            },
        },
    ],
};
