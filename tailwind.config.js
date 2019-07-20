module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#49D3B4',
        primaryForeground: '#141C26',
      },
      container: {
        center: true,
        padding: '2rem',
      },
      lineHeight: {
        tight: 1.1,
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
        },
        h2: {
          marginBottom: config('theme.margin.6'),
          lineHeight: config('theme.lineHeight.normal'),
          fontSize: config('theme.fontSize.xl'),
          fontWeight: config('theme.fontWeight.normal'),
          color: config('theme.colors.gray.800'),
        },
        h3: {
          lineHeight: config('theme.lineHeight.normal'),
          fontSize: config('theme.fontSize.lg'),
          fontWeight: config('theme.fontWeight.medium'),
          color: config('theme.colors.gray.800'),
        },
        h4: {
          lineHeight: config('theme.lineHeight.normal'),
          fontSize: config('theme.fontSize.base'),
          fontWeight: config('theme.fontWeight.light'),
          color: config('theme.colors.gray.600'),
        },
      })
    },
  ],
}
