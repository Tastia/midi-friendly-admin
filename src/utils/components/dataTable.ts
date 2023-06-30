import { FetchParams } from "~/components/Core/DataTable/types";
import { resolveFromStringPath } from "../data/object";

export const DataMapperRemote = async (
  datasource: () => Promise<any[]>,
  { searchQuery, page, limit, sortKey, sortOrder, query }: FetchParams
): Promise<{ totalDocs: number; totalPages: number; docs: any[] }> => {
  try {
    let output = (await datasource()) || [];
    if (searchQuery?.value) {
      output = output.filter((item) => {
        const keys = Object.keys(item).filter((key) =>
          searchQuery.fields.includes(key)
        );
        for (const key of keys)
          if (
            item[key] &&
            item[key]
              ?.toString()
              ?.toLowerCase()
              ?.includes(searchQuery?.value?.toLowerCase())
          )
            return true;
        return false;
      });
    }

    // Process sorting
    if (sortKey) {
      output = output.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        if (aValue === bValue) return 0;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      });
    }

    if (query && Object.keys(query).length > 0) {
      for (const key in query) {
        const filters = query[key];
        output = output.filter((item) => {
          const value: any = resolveFromStringPath(key, item);
          for (const filter of filters) {
            if (filter.matchMode === "equals") {
              console.log({ filter: filter.value, value: value });

              return !!(filter.value === value);
            }
            if (filter.matchMode === "contains")
              return !!(item[key] && value.includes(filter.value));
            if (filter.matchMode === "between")
              return !!(value >= filter.value[0] && value <= filter.value[1]);
            if (filter.matchMode === "arrayContains")
              return !!(item[key] && filter.value.includes(item[key]));
          }
          return false;
        });
      }
    }

    const totalDocs = output.length;
    const totalPages = Math.ceil(totalDocs / limit);

    // Process pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    output = output.slice(start, end);

    return { totalDocs, totalPages, docs: output };
  } catch (err) {
    console.error(err);
    return {
      docs: [],
      totalPages: 0,
      totalDocs: 0,
    };
  }
};
