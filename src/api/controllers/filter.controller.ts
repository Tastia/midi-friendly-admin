import { ApiInstance } from "./../instance";

export const FilterController = {
  getOrganizations: () =>
    ApiInstance.get<Array<{ _id: string; name: string }>>(
      "/filters/organizations"
    ).then((res) => res.data),
};
