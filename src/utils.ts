/**
 * Checks if two values have changed.
 *
 * This function performs a deep comparison between two values to determine if they are different.
 * It can handle nested objects, arrays, objects with other types, arrays with other types, and other types.
 *
 * @param oldValue The old value to compare.
 * @param newValue The new value to compare.
 * @returns A boolean indicating whether the values have changed.
 */

export function hasValueChanged(oldValue: any, newValue: any): boolean {
  // If both values are not objects or arrays, perform a strict equality check
  if (
    typeof oldValue !== 'object' &&
    !Array.isArray(oldValue) &&
    typeof newValue !== 'object' &&
    !Array.isArray(newValue)
  ) {
    return oldValue !== newValue;
  }

  // If one value is null or undefined and the other is not, they are different
  if (
    ((oldValue === null || oldValue === undefined) &&
      !(newValue === null || newValue === undefined)) ||
    ((newValue === null || newValue === undefined) &&
      !(oldValue === null || oldValue === undefined))
  ) {
    return true;
  }

  // If both values are null or undefined, they are considered equal
  if (
    (oldValue === null || oldValue === undefined) &&
    (newValue === null || newValue === undefined)
  ) {
    return false;
  }

  // If the types are different, they are considered different
  if (
    typeof oldValue !== typeof newValue ||
    Array.isArray(oldValue) !== Array.isArray(newValue)
  ) {
    return true;
  }

  // If the values are arrays, compare each element recursively
  if (Array.isArray(oldValue)) {
    if (oldValue.length !== newValue.length) {
      return true;
    }
    for (let i = 0; i < oldValue.length; i++) {
      if (hasValueChanged(oldValue[i], newValue[i])) {
        return true;
      }
    }
    return false;
  }

  // If the values are objects, compare each property recursively
  const oldKeys = Object.keys(oldValue);
  const newKeys = Object.keys(newValue);
  if (oldKeys.length !== newKeys.length) {
    return true;
  }

  for (const key of oldKeys) {
    if (
      !newKeys.includes(key) ||
      hasValueChanged(oldValue[key], newValue[key])
    ) {
      return true;
    }
  }

  // If all properties are equal, the objects are equal
  return false;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function extractValueFrom<T = any>(
  key: string,
  object: Record<string, any>,
) {
  if (!object) {
    return null;
  }

  const keys = key.split('.');
  let current = object;

  for (const k of keys) {
    if (!(k in current)) {
      return null;
    }

    current = current[k];
  }

  return current as T;
}
