const { staticColorFields } = require('@brunolemos/devhub-core')

// for some reason the build fails when using require('./src/helpers')
// so I copy pasted the method here for now
function toKebabCase(str) {
  if (!(str && typeof str === 'string')) return ''

  const matches = str.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+|\b)|[A-Z]?[a-z]+|[A-Z]|[0-9]+/g,
  )
  if (!(matches && matches.length)) return str

  return matches.map(s => s.toLowerCase()).join('-')
}

module.exports = {
  theme: {
    colors: {
      primary: {
        default: 'var(--theme-primary-background-color)',
        foreground: 'var(--theme-primary-foreground-color)',
      },
      transparent: 'transparent',
      ...Object.assign(
        {},
        ...staticColorFields.map(color => ({
          [toKebabCase(color)]: `var(--theme-${toKebabCase(color)})`,
        })),
      ),
      bg: {
        default: 'var(--theme-background-color)',
        'darker-1': 'var(--theme-background-color-darker-1)',
        'darker-2': 'var(--theme-background-color-darker-2)',
        'darker-3': 'var(--theme-background-color-darker-3)',
        'darker-4': 'var(--theme-background-color-darker-4)',
        'darker-5': 'var(--theme-background-color-darker-5)',
        'lighther-1': 'var(--theme-background-color-lighther-1)',
        'lighther-2': 'var(--theme-background-color-lighther-2)',
        'lighther-3': 'var(--theme-background-color-lighther-3)',
        'lighther-4': 'var(--theme-background-color-lighther-4)',
        'lighther-5': 'var(--theme-background-color-lighther-5)',
        'more-1': 'var(--theme-background-color-more-1)',
        'more-2': 'var(--theme-background-color-more-2)',
        'more-3': 'var(--theme-background-color-more-3)',
        'more-4': 'var(--theme-background-color-more-4)',
        'more-5': 'var(--theme-background-color-more-5)',
        'less-1': 'var(--theme-background-color-less-1)',
        'less-2': 'var(--theme-background-color-less-2)',
        'less-3': 'var(--theme-background-color-less-3)',
        'less-4': 'var(--theme-background-color-less-4)',
        'less-5': 'var(--theme-background-color-less-5)',
        'transparent-05': 'var(--theme-background-color-transparent-05)',
        'transparent-10': 'var(--theme-background-color-transparent-10)',
        'tinted-red': 'var(--theme-background-color-tinted-red)',
      },
      text: {
        default: 'var(--theme-foreground-color)',
        muted: {
          default: 'var(--theme-foreground-color-muted-65)',
          10: 'var(--theme-foreground-color-muted-10)',
          25: 'var(--theme-foreground-color-muted-25)',
          40: 'var(--theme-foreground-color-muted-40)',
          65: 'var(--theme-foreground-color-muted-65)',
        },
        transparent: {
          05: 'var(--theme-foreground-color-transparent-05)',
          10: 'var(--theme-foreground-color-transparent-10)',
        },
      },
    },
    extend: {
      backgroundColor: theme => theme('colors.bg'),
      textColor: theme => theme('colors.text'),
      borderColor: theme => ({
        ...theme('colors'),
        text: {
          default: 'var(--theme-foreground-color)',
          muted: 'var(--theme-foreground-color-muted-65)',
          'muted-10': 'var(--theme-foreground-color-muted-10)',
          'muted-25': 'var(--theme-foreground-color-muted-25)',
          'muted-40': 'var(--theme-foreground-color-muted-40)',
          'muted-65': 'var(--theme-foreground-color-muted-65)',
        },
      }),
      container: {
        center: true,
        padding: '2rem',
      },
      flex: {
        '2': '2 2 0%',
      },
      lineHeight: {
        tight: 1.1,
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '100': '26rem',
        '150': '36rem',
      },
    },
  },
  variants: {},
  plugins: [
    function({ addBase, config }) {
      addBase({
        h1: {
          marginBottom: config('theme.margin.6'),
          lineHeight: config('theme.lineHeight.tight'),
          fontSize: config('theme.fontSize.4xl'),
          fontWeight: config('theme.fontWeight.bold'),
          color: config('theme.textColor.default'),
        },
        h2: {
          marginBottom: config('theme.margin.6'),
          lineHeight: config('theme.lineHeight.relaxed'),
          fontSize: config('theme.fontSize.xl'),
          fontWeight: config('theme.fontWeight.normal'),
          color: config('theme.textColor.muted.65'),
        },
        h3: {
          marginBottom: config('theme.margin.2'),
          lineHeight: config('theme.lineHeight.relaxed'),
          fontSize: config('theme.fontSize.lg'),
          fontWeight: config('theme.fontWeight.medium'),
          color: config('theme.textColor.default'),
        },
        h4: {
          marginBottom: config('theme.margin.2'),
          lineHeight: config('theme.lineHeight.relaxed'),
          fontSize: config('theme.fontSize.base'),
          fontWeight: config('theme.fontWeight.light'),
          color: config('theme.textColor.muted.65'),
        },
      })
    },
  ],
}
