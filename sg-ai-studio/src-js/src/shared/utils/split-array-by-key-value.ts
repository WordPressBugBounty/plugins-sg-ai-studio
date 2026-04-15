type GenericObject = Record<string, any>;

export function splitArrayByKeyValue<T extends GenericObject>(array: T[], key: keyof T, value: T[keyof T]): T[][] {
  const result: T[][] = [];
  let currentChunk: T[] = [];

  for (const item of array) {
    if (item[key] === value) {
      if (currentChunk.length > 0) {
        result.push(currentChunk);
      }
      currentChunk = [item];
    } else {
      currentChunk.push(item);
    }
  }

  if (currentChunk.length > 0) {
    result.push(currentChunk);
  }

  return result;
}
