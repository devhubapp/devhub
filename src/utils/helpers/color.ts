import warna from 'warna'

export const { darken, lighten } = warna

export function fade(color: string, opacity: number = 1) {
  const { rgb } = warna.parse(color)
  return `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${opacity})`
}
