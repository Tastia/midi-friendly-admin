import { TableFilter } from "~/components/Core/DataTable/types";

type FilterFactory = (key: string, ...args: any[]) => TableFilter;

export const TextFilter: FilterFactory = (
  key: string,
  matchMode: "equals" | "contains"
) => ({
  key,
  matchMode,
  type: "text",
  label: capitalize(formatKey(key)),
});

export const BooleanFilter: FilterFactory = (
  key: string,
  label: string,
  options: { truthyValue?: boolean; falsyValue?: boolean }
) => ({
  key,
  label,
  type: "radio",
  matchMode: "arrayContains",
  options: [
    { label: "Yes", value: options?.truthyValue ?? true },
    { label: "No", value: options?.falsyValue ?? false },
    { label: "All", value: null },
  ],
  transform: (value: boolean) => (value !== null ? [value] : []),
});

export const BooleanExistFilter: FilterFactory = (
  key: string,
  label: string
) => ({
  ...BooleanFilter(key, label),
  matchMode: "exists",
});

export const TimePeriodFilter: FilterFactory = (
  key: string,
  label: string
) => ({
  key,
  label,
  type: "daterange",
  transform: (value: any[]) => {
    return !Array.isArray(value) || value.some((value) => !value)
      ? null
      : value.map(formatDateToISOstring);
  },
  preformat: (value: any) =>
    value?.length ? value.map((date: string) => new Date(date)) : null,
  matchMode: "between",
  params: { dateMode: true },
});
