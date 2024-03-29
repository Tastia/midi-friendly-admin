import { deepmerge } from "deepmerge-ts";

export const RemoveNullFromObject = (obj: { [key: string]: any }) => {
  const newObj = {} as { [key: string]: any };
  for (const key in obj) {
    if (obj[key] === null) continue;
    else if (typeof obj[key] === "object" && !Array.isArray(obj[key]))
      newObj[key] = RemoveNullFromObject(obj[key]);
    else newObj[key] = obj[key];
  }

  return newObj;
};

export const pipeMergeObject = <T>(...args: T[]) =>
  args.reduce((acc, curr) => deepmerge(acc as any, curr as any), {});

export const ObjectSerializer = {
  read: (string: string) => {
    try {
      return JSON.parse(string);
    } catch (err) {
      return string;
    }
  },
  write: (value: Record<string, any> | null) =>
    value ? JSON.stringify(value) : value,
};

export const resolveFromStringPath = (
  path: string,
  obj: { [key: string]: any },
  separator = "."
) => {
  try {
    const properties: string[] = Array.isArray(path)
      ? path
      : path.split(separator);
    const value = properties.reduce((prev, curr) => prev && prev[curr], obj);
    return value;
  } catch (err) {
    return undefined;
  }
};
