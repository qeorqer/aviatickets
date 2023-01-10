module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'prettier',
    'prettier/prettier',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/jsx-filename-extension': 'off',
    'import/extensions': 'off',
    'no-shadow': 'off',
    'max-len': 'off',
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'import/prefer-default-export': 'off',
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
      },
    ],
    'react/prop-types': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'no-use-before-define': 'off',
    'click-events-have-key-events': 'off',
    'import/no-unresolved': 'off',
    'global-require': 'off',
    'import/no-absolute-path': 'off',
    'no-empty-pattern': 'off',
    'prettier/prettier': 'warn',
  },
};
