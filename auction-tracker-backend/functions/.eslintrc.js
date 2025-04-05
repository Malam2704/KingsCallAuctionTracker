module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "off",
    "arrow-parens": "off",
    "no-unused-vars": "warn"
  },
  parserOptions: {
    "ecmaVersion": 2017
  }
};