import { CreateOrganizationDto, Organization } from "~/types/organization";
import { OrganizationList } from "~/types/organization";
import { ApiInstance } from "../instance";

export const OrganizationController = {
  getOrganizations: () =>
    ApiInstance.get<OrganizationList>("/organizations").then(
      (response) => response.data
    ),
  getOrganizationById: (organizationId: string) =>
    ApiInstance.get<Organization>(`/organizations/${organizationId}`).then(
      (response) => response.data
    ),
  createOrganization: (data: CreateOrganizationDto) =>
    ApiInstance.post<OrganizationList[number]>("/organizations", data).then(
      (response) => response.data
    ),
  updateOrganization: (organizationId: string) =>
    ApiInstance.post<OrganizationList[number]>(
      `/organizations/${organizationId}`
    ).then((response) => response.data),
};
