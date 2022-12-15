import { FormSchema } from "@chronicstone/vue-sweetforms";
import { OrganizationController } from "~/api/controllers/organization.controller";
import { DataTableSchema } from "~/components/Core/DataTable/types";
import {
  CreateOrganizationDto,
  OrganizationList,
} from "~/types/organization.type";

export function OrganizationTableSchema(): DataTableSchema<
  OrganizationList[number]
> {
  return {
    remote: false,
    searchQuery: [
      "name",
      "address.street",
      "address.city",
      "address.country",
      "address.zip",
    ],
    columns: [
      { label: "Organization", key: "name" },
      { label: "Address - street", key: "address.street" },
      { label: "Address - city", key: "address.city" },
      { label: "Address - country", key: "address.country" },
      { label: "Address - zip", key: "address.zip" },
      { label: "Created at", key: "createdAt", render: formatDateTime },
      { label: "Updated at", key: "updatedAt", render: formatDateTime },
    ],
    datasource: OrganizationController.getOrganizations,
    actions: [
      {
        label: "Create organization",
        icon: "mdi:plus",
        action: ({ tableApi }) =>
          CreateOrganization().then(
            (shouldRefresh) => shouldRefresh && tableApi.value.refreshData()
          ),
      },
    ],
    rowActions: ({ data }) => [],
  };
}

export function OrganizationFormSchema(
  mode: "create" | "update" = "create"
): FormSchema {
  return {
    title:
      mode === "create" ? "Create organization" : "Update organization profile",
    gridSize: 8,
    fieldSize: 8,
    fields: [
      { label: "Name", key: "name", type: "text", required: true },
      {
        label: "Address",
        key: "address",
        type: "object",
        fields: [
          {
            label: "Street",
            key: "street",
            type: "text",
            required: true,
            size: "8 md:4",
          },
          {
            label: "City",
            key: "city",
            type: "text",
            required: true,
            size: "8 md:4",
          },
          {
            label: "ZIP Code",
            key: "zip",
            type: "text",
            required: true,
            size: "8 md:4",
          },
          {
            label: "Country",
            key: "Country",
            type: "text",
            required: true,
            size: "8 md:4",
          },
        ],
      },
    ],
  };
}

export async function CreateOrganization() {
  try {
    const { formApi, messageApi } = useReactifiedApi();
    const { isCompleted, formData } = await formApi.createForm(
      OrganizationFormSchema()
    );

    if (!isCompleted) return false;

    await OrganizationController.createOrganization(
      formData as CreateOrganizationDto
    );

    messageApi.success("Organization successfuly created!");
    return true;
  } catch (err) {
    console.error(err);
  }
}
