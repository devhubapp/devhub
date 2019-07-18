module.exports = {
  theme: {
    extend: {
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
          marginBottom: config('theme.margin.5'),
          lineHeight: config('theme.lineHeight.tight'),
          fontSize: config('theme.fontSize.5xl'),
          fontWeight: config('theme.fontWeight.bold'),
        },
        h2: {
          marginBottom: config('theme.margin.5'),
          lineHeight: config('theme.lineHeight.snug'),
          fontSize: config('theme.fontSize.xl'),
          fontWeight: config('theme.fontWeight.normal'),
          fontWeight: config('theme.fontWeight.normal'),
          color: config('theme.colors.gray.800'),
        },
      })
    },
  ],
}
