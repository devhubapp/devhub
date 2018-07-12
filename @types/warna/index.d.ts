declare module 'warna' {
  interface RGB {
    red: number
    green: number
    blue: number
    alpha?: number
  }

  interface HSV {
    hue: number
    saturation: number
    value: number
    alpha?: number
  }

  interface HSL {
    hue: number
    saturation: number
    luminosity: number
    alpha?: number
  }

  type Color = string | RGB | HSV | HSL

  interface ParsedColor {
    rgb: RGB
    hex: string
    hsv: string
    hsl: string
    alpha: number
  }

  export class Gradient {
    static getPosition(pos: number): ParsedColor
    static getSlices(
      slice: number,
      type: 'rgb' | 'hsv' | 'hsl' | undefined,
    ): ParsedColor[] | ((RGB[] | string[]) & { alpha: string })
    constructor(begin: number, end: number)
  }

  export function darken(color: Color, pos: number): ParsedColor
  export function lighten(color: Color, pos: number): ParsedColor
  export function parse(color: Color): ParsedColor
}
