declare module 'warna' {
  export class Gradient {
    constructor(begin: any, end: any)
    getPosition(pos: any): any
    getSlices(slice: any, type: any): any
  }

  export function darken(color: any, pos: any): any
  export function lighten(color: any, pos: any): any
  export function parse(color: any): any
}
