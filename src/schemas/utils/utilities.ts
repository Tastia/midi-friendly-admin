export const If = (cond: any, value: any, nullReturn: any = null) =>
  cond ? value : Array.isArray(value) ? [] : null;
