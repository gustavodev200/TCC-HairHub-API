import { ObjectWithAnyKeys, excludeFields } from "./excludeFields";

export function parseArrayOfData<T extends ObjectWithAnyKeys>(
  array: T[],
  keys: Array<keyof T>
): Array<Omit<ObjectWithAnyKeys, string>> {
  return array.map((item) => excludeFields(item, keys));
}
