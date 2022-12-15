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
  args.reduce((acc, curr) => deepmerge(acc, curr), {});
