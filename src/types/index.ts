export * from './github'

export type Theme = '' | 'auto' | 'light' | 'dark' | 'dark-blue'

export interface IBaseTheme {
  blue: string,
  blueGray: string,
  brand: string,
  brandSecondary: string,
  brown: string,
  darkGray: string,
  gray: string,
  green: string,
  indigo: string,
  lightBlue: string,
  lightRed: string,
  orange: string,
  pink: string,
  purple: string,
  red: string,
  star: string,
  teal: string,
  yellow: string,
}

export interface ITheme extends IBaseTheme {
  base00: string,
  base01: string,
  base02: string,
  base03: string,
  base04: string,
  base05: string,
  base06: string | undefined,
  base07: string,
  base08: string,
  base09: string | undefined,
  base0A: string | undefined,
  base0B: string | undefined,
  base0C: string | undefined,
  base0D: string | undefined,
  base0E: string | undefined,
  base0F: string | undefined,
}
