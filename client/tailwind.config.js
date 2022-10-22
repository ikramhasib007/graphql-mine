const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './pages/**/*.{html,js,ts,jsx,tsx}',
    './src/**/*.{html,js,ts,jsx,tsx}'
  ],
  darkMode: "media", // or 'class'
  theme: {
    container: {
      center: true,
    },
    divideColor: theme => ({
      ...theme('borderColors'),
      neutral: colors.indigo,
    }),
    extend: {
      screens: {
        '3xl': '1920px',
      },
      animation: {
        wiggle: 'wiggle 0.5s ease-in-out infinite',
        'pulse-1s':	'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce200: 'bounce 1s infinite 200ms',
        bounce400: 'bounce 1s infinite 400ms',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'width': 'width',
        'scroll': 'scroll',
        'order': 'order',
      },
      colors: {
        current: 'currentColor',
        rose: colors.rose,
        sky: colors.sky,
        slate: colors.slate,
        teal: colors.teal,
        cyan: colors.cyan,
        green: colors.green,
        brand: colors.zinc,
        neutral: colors.zinc,
        danger: colors.red,
        success: colors.emerald,
        warning: colors.yellow,
        grape: colors.purple,

        facebook: '#039be5',
        twitter: '#03A9F4',
        linkedin: '#0078d4',
        'google-1': '#FFC107',
        'google-2': '#FF3D00',
        'google-3': '#4CAF50',
        'google-4': '#1976D2'
      },
      zIndex: {
        '1': '1',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        serif: ['Merriweather', 'serif'],
      },
      fontSize: {
        '2.5xl': ['1.625rem', '2rem']
      },
      spacing: {
        '0.25': '0.0625rem',
        '0.75': '0.1875rem',
        '1.25': '0.3125rem',
        '1.75': '0.4375rem',
        '2.75': '0.6875rem',
        '4.5': '1.125rem',
        '4.25': '1.0625rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '9.5': '2.375rem',
        '10.5': '2.625rem',
        '11.5': '2.875rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '17.5': '4.375rem', // navbar height
        '18': '4.5rem',
        '19': '4.75rem',
        '21.5': '5.375rem',
        '22': '5.5rem',
        '46': '11.5rem',
        '60.5':	'15.5rem',
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
      },
      opacity: {
        '2': '0.02',
        '3': '0.03',
        '15': '0.15',
        '35': '0.35',
        '65': '0.65',
      },
      minHeight: {
        '12': '3rem',	
        '16':	'4rem',
        '20':	'5rem',
        '24':	'6rem',
        '28':	'7rem',	
        '32':	'8rem',	
        '36':	'9rem',	
        '40':	'10rem',
        '44':	'11rem',
        '48':	'12rem',
        '52':	'13rem',
        '56':	'14rem',
        '60':	'15rem',
        '64':	'16rem'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),

    plugin(function({ addVariant, e }) {
      addVariant('readonly', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`readonly${separator}${className}`)}:readonly`
        })
      })
    }),
    plugin(function({ addVariant, e }) {
      addVariant('disabled', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`disabled${separator}${className}`)}:disabled`
        })
      })
    })
  ],
}
