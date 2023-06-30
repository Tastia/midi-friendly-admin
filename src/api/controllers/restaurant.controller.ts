import { FetchParams } from "@/components/Core/DataTable/types";
import { Restaurant } from "@/types/restaurant";
import { ApiInstance } from "@/api/instance";

export const RestaurantController = {
  getList: (query: FetchParams) =>
    ApiInstance.post<Restaurant[]>("/restaurants/list", query).then(
      (response) => response.data
    ),
  getRestaurants: () =>
    ApiInstance.get<Restaurant[]>("/restaurants").then(
      (response) => response.data
    ),
};
