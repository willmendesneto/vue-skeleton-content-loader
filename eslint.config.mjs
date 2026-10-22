import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import vitest from '@vitest/eslint-plugin';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default defineConfig(
  {
    ignores: ['node_modules', 'dist', 'dist-demo', 'coverage', 'index.js'],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'vue/html-indent': 'off',
      'vue/first-attribute-linebreak': [
        'error',
        {
          singleline: 'ignore',
          multiline: 'below',
        },
      ],
    },
  },
  {
    files: ['**/*.spec.ts'],
    ...vitest.configs.recommended,
    languageOptions: {
      globals: vitest.environments.env.globals,
    },
  },
  prettierRecommended,
);
