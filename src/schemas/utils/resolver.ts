import { FilterController } from "~/api/controllers/filter.controller";

export const GetOrganizations = () =>
  FilterController.getOrganizations().then((data) =>
    data.map((item) => ({ label: item.name, value: item._id }))
  );
