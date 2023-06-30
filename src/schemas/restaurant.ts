import { Restaurant } from "~/types/restaurant";
import { buildTableSchema } from "@chronicstone/vue-sweettools";

export function RestaurantTableSchema(organizationId?: string) {
  return buildTableSchema<Restaurant>({
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
    filters: [organizationFilter("organization._id")],
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
    actions: [
      {
        label: "Insert restaurant",
        icon: "mdi:plus",
        action: ({ tableApi }) =>
          manuallyInsertRestaurant().then(
            (shouldRefresh) => shouldRefresh && tableApi.refreshData()
          ),
      },
    ],
    rowActions: [
      {
        icon: ({ rowData }) =>
          rowData.disabled
            ? "material-symbols:toggle-off-outline"
            : "material-symbols:toggle-on",
        tooltip: ({ rowData }) => (rowData.disabled ? "Enable" : "Disable"),
        action: ({ rowData, tableApi }) =>
          toggleRestaurant(rowData).then(
            (shouldRefresh) => shouldRefresh && tableApi.refreshData()
          ),
      },
    ],
  });
}

export async function toggleRestaurant(restaurant: Restaurant) {
  try {
    const { $messageApi } = useNuxtApp();
    const proceed = await useConfirmDialog({
      type: "warning",
      title: "Toggle restaurant",
      content: `Are you sure you want to ${
        restaurant.disabled ? "enable" : "disable"
      } this restaurant?`,
    });

    if (!proceed) return false;

    await RestaurantController.toggleRestaurant(restaurant._id);
    $messageApi.success(
      `Restaurant ${restaurant.name} has been ${
        restaurant.disabled ? "enabled" : "disabled"
      }`
    );
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function manuallyInsertRestaurant() {
  try {
    const { $formApi, $messageApi } = useNuxtApp();
    const { formData, isCompleted } = await $formApi.createForm({
      fields: [
        { key: "placeId", label: "Place ID", type: "text", required: true },
      ],
    });

    if (!isCompleted) return false;

    const restaurant = await RestaurantController.insertRestaurantByPlaceId(
      formData.placeId
    );
    $messageApi.success(`Restaurant ${restaurant.name} has been inserted`);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
