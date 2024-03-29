import { TableFilter as TTableFilter } from "~/components/Core/DataTable/types";
import type { TableFilter } from "@chronicstone/vue-sweettools";

type FilterFactory = (key: string, ...args: any[]) => TTableFilter;

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

export const OrganizationFilter: FilterFactory = (key: string) => ({
  key,
  label: "Organization",
  type: "select",
  options: GetOrganizations,
  matchMode: "arrayContains",
});

export function credentialProviderFilter(key: string): TableFilter {
  return {
    key,
    label: "Credential Provider",
    type: "select",
    options: [
      { label: "Email", value: "email" },
      { label: "Google", value: "google" },
      { label: "Facebook", value: "facebook" },
      { label: "LinkedIn", value: "linkedin" },
    ],
    matchMode: "arrayContains",
  };
}

export function organizationFilter(key: string): TableFilter {
  return {
    key,
    label: "Organization",
    type: "select",
    options: GetOrganizations,
    matchMode: "arrayContains",
  };
}
