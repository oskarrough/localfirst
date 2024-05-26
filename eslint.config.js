import globals from 'globals'
import js from '@eslint/js'
// import jsdoc from 'eslint-plugin-jsdoc'
// import pluginLit from 'eslint-plugin-lit'
import {configs as wcConfigs} from 'eslint-plugin-wc'

export default [
  js.configs.recommended, // eslint recommended
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
    rules: {
    	// This can be enabled if we want to clean up unused variables, but it's not necessary.
      'no-unused-vars': 'warn',
    },
  },
]
