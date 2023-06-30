import { FetchParams } from "@chronicstone/vue-sweettools";
import { LunchGroup } from "@/types/lunchGroups";

export const LunchGroupController = {
  getList: (query: FetchParams) =>
    ApiInstance.post<LunchGroup[]>("/lunch-group/list", query).then(
      (response) => response.data
    ),
};
