import antfu from '@antfu/eslint-config'

export function createNuxtSharedConfig(withNuxt) {
  return withNuxt(
    antfu(
      {
        stylistic: {
          indent: 2,
          quotes: 'single',
          semi: false,
        },
      },
      {
        ignores: ['.github/*'],
      },
      {
        name: 'base-rules',
        files: ['**/*'],
        rules: {
          'node/prefer-global/process': 'off',
          'style/quotes': ['error', 'single', { avoidEscape: true }],
          'style/space-before-function-paren': ['error', 'always'],
          'ts/array-type': ['error', { default: 'generic' }],
          'no-console': ['error', { allow: [''] }],
          'vue/max-attributes-per-line': [
            'error',
            {
              multiline: {
                max: 1,
              },
              singleline: {
                max: 1,
              },
            },
          ],
        },
      },
      {
        name: 'sorting',
        files: ['**/*.{ts,js,vue}'],
        rules: {
          'import/order': 'off',
          'perfectionist/sort-array-includes': 'error',
          'perfectionist/sort-exports': 'error',
          'perfectionist/sort-imports': ['error', {
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
            newlinesBetween: 'always',
          }],
          'perfectionist/sort-interfaces': 'error',
          'perfectionist/sort-named-exports': 'error',
          'perfectionist/sort-named-imports': 'error',
          'perfectionist/sort-object-types': 'error',
          'perfectionist/sort-objects': [
            'error',
            {
              order: 'asc',
              type: 'natural',
            },
          ],
          'perfectionist/sort-union-types': 'error',
          'sort-imports': 'off',
        },
      },
    ),
  )
}

