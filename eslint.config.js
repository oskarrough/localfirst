import globals from 'globals'
import js from '@eslint/js'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
// import jsdoc from 'eslint-plugin-jsdoc'
// import pluginLit from 'eslint-plugin-lit'
// import {configs as wcConfigs} from 'eslint-plugin-wc'

export default [
  js.configs.recommended, // eslint recommended
  eslintPluginUnicorn.configs['flat/recommended'],
  // jsdoc.configs['flat/recommended'], // for jsdoc
  // unicorn/recommended
  // prettier
  // plugin:prettier/recommended
  // wcConfigs['flat/recommended'], // for web components
  // pluginLit.configs['flat/recommended'], // for lit elements
  {
    languageOptions: {
      globals: globals.browser,
    },
    // plugins: {
    //   unicorn: eslintPluginUnicorn
    // },
    rules: {
      'unicorn/prevent-abbreviations': 'warn'
      // This can be enabled if we want to clean up unused variables, but it's not necessary.
      // 'no-unused-vars': 'warn',
    },
  },
]
