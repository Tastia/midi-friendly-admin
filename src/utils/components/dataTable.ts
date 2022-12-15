import { FetchParams } from "~/components/Core/DataTable/types";

export const DataMapperRemote = async (
  datasource: () => Promise<any[]>,
  { searchQuery, page, limit, sortKey, sortOrder }: FetchParams
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
