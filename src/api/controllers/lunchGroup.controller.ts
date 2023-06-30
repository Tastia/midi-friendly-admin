import { FetchParams } from "@/components/Core/DataTable/types";
import { LunchGroup } from "@/types/lunchGroups";

export const LunchGroupController = {
  getList: (query: FetchParams) =>
    ApiInstance.post<LunchGroup[]>("/lunch-group/list", query).then(
      (response) => response.data
    ),
};
