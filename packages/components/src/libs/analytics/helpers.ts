import _ from 'lodash'

export function sanitizeDimensionValue(value: any) {
  if (typeof value === 'string') return value
  if (typeof value === 'boolean' || typeof value === 'number') return `${value}`
  if (value) return `${value}`
  return null
}

export function sanitizeDimensions<D extends Partial<Record<string, any>>>(
  dimensions: D,
) {
  return _.mapValues(dimensions, sanitizeDimensionValue) as Record<
    keyof D,
    'string' | null
  >
}
