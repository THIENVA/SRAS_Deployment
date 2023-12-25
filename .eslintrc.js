module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    settings: {
        react: {
            version: 'detect',
        },
        'import/resolver': {
            node: {
                paths: ['src'],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    extends: [
        'prettier',
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:import/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
    plugins: ['unused-imports', 'import'],
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        babelOptions: { configFile: `${__dirname}/.babelrc` },
    },
    rules: {
        'prettier/prettier': 'error',
        'no-console': 'warn',
        'no-eval': 'warn',
        'no-proto': 2,
        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': 'warn',
        'react/display-name': 'off',
        'react/prop-types': 'off',
        'react/jsx-uses-react': 'error',
        'react/react-in-jsx-scope': 'off',
        'react-hooks/exhaustive-deps': 'error',
        'import/no-unresolved': 'off',
        'no-duplicate-imports': 'error',
        'sort-imports': [
            'error',
            {
                ignoreDeclarationSort: true,
            },
        ],
    },
}
