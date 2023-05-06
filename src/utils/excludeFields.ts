export type ObjectWithAnyKeys = Record<string, any>;

export function excludeFields<T extends ObjectWithAnyKeys, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  return Object.keys(obj).reduce((acc, key) => {
    if (!keys.includes(key as K)) {
      const newKey = key as Exclude<keyof T, K>;
      acc[newKey] = obj[newKey];
    }
    return acc;
  }, {} as Omit<T, K>);
}
