import { Restaurant } from "../../types/restaurant";
import { ApiInstance } from "./../instance";

export const RestaurantController = {
  getRestaurants: () =>
    ApiInstance.get<Restaurant[]>("/restaurants").then(
      (response) => response.data
    ),
};
