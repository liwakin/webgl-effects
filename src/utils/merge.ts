import { isObject } from './is'

export function mergeOptions<
  D extends Record<string, any>,
  O extends Record<string, any>
>(defaults: D, overrides: O, inPlace = false): D {
  const merged: D = inPlace ? defaults : { ...defaults }

  for (const key in overrides) {
    const value = overrides[key]
    if (value == null) {
      continue
    }

    const existing = merged[key]

    if (existing == null) {
      merged[key] = value
      continue
    }

    if (isObject(existing) && isObject(value)) {
      merged[key] = mergeOptions(existing, value, inPlace)
      continue
    }
    merged[key] = value
  }

  return merged
}
