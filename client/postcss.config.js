module.exports = {
  plugins: [
    'postcss-import',
    'tailwindcss',
    [
      'cssnano', {
        preset: ['default', {
          discardComments: {
              removeAll: true,
          },
      }]
      }
    ],
    'postcss-nested',
    'postcss-custom-properties',
    [
      'postcss-preset-env', {
        stage: 1,
        features: {
          'focus-within-pseudo-class': false
        }
      }
    ],
    'postcss-fail-on-warn',
    'autoprefixer',    
  ]
}
