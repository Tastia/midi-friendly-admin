import { Restaurant } from "~/types/restaurant.types";
import { DataTableSchema } from "~/components/Core/DataTable/types";
import { RestaurantController } from "~/api/controllers/restaurant.controller";

export function RestaurantTableSchema(): DataTableSchema<Restaurant> {
  return {
    remote: false,
    columns: [
      { label: "Restaurant name", key: "name" },
      {
        label: "Organization",
        key: "organization.coordinates.latitude",
        render: (value) => "value",
      },
    ],
    datasource: RestaurantController.getRestaurants,
  };
}
