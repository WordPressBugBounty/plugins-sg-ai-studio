export const isObjectEmpty = (data: Record<string, unknown> | undefined): boolean => {
  if (data === undefined) {
    return true;
  }
  return Object.entries(data).length === 0;
};
