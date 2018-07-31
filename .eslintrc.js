module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8
  },
  env: {
    browser: true,
    node: true
  },
  extends: ['airbnb-base', 'plugin:vue/recommended', 'prettier'],
  globals: {},
  plugins: ['vue'],
  rules: {
    'comma-dangle': 2,
    'import/extensions': 0,
    'linebreak-style': 0,
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-shadow': 0,
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 2 : 0,
    semi: 0
  }
}
