import { DataTableSchema } from "~/components/Core/DataTable/types";

export function OrganizationTableSchema(): DataTableSchema {
  return {
    remote: false,
    columns: [
      { label: "Organization", key: "name" },
      { label: "Created at", key: "createdAt", render: formatDateTime },
    ],
    datasource: async () => [],
  };
}
