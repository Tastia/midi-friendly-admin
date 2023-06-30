import { Restaurant } from "~/types/restaurant";
import { DataTableSchema } from "~/components/Core/DataTable/types";

export function RestaurantTableSchema(
  organizationId?: string
): DataTableSchema<Restaurant> {
  return {
    remote: true,
    searchQuery: [
      "name",
      "organization.name",
      "address.street",
      "address.city",
      "address.zip",
      "address.country",
    ],
    staticFilters: organizationId
      ? [
          {
            key: "organization._id",
            value: organizationId,
            matchMode: "equals",
          },
        ]
      : [],
    filters: [OrganizationFilter("organization._id")],
    columns: [
      { label: "Restaurant name", key: "name" },
      { label: "Organization", key: "organization.name" },
      { label: "Street", key: "address.street", render: formatNullableText },
      { label: "City", key: "address.city", render: formatNullableText },
      { label: "Zip", key: "address.zip", render: formatNullableText },
      { label: "Country", key: "address.country", render: formatNullableText },
      { label: "Created at", key: "createdAt", render: formatDate },
    ],
    datasource: RestaurantController.getList,
  };
}
