import { FetchParams } from "@chronicstone/vue-sweettools";
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
  toggleRestaurant: (restaurantId: string) =>
    ApiInstance.patch<boolean>(
      `/restaurants/toggle-restaurant/${restaurantId}`
    ).then((response) => response.data),
  insertRestaurantByPlaceId: (placeId: string) =>
    ApiInstance.post<Restaurant>(
      `/restaurants/insert-restaurant-by-place-id/${placeId}`
    ).then((response) => response.data),
};
