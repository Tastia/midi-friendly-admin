import { DataTableSchema } from "@/components/Core/DataTable/types";
import { LunchGroup } from "@/types/lunchGroups";
import {
  RenderEllipsisText,
  RenderUser,
  RenderUserStack,
} from "./utils/renderer";
import { User } from "../types/user";

export function LunchGroupTableSchema(
  organizationId?: string
): DataTableSchema<LunchGroup> {
  return {
    remote: true,
    searchQuery: ["label", "owner.firstName", "owner.lastName", "owner.email"],
    filters: [OrganizationFilter("organization._id")],
    staticFilters: organizationId
      ? [
          {
            key: "organization._id",
            value: organizationId,
            matchMode: "equals",
          },
        ]
      : [],
    columns: [
      { label: "Organizatio ", key: "organization.name" },
      { label: "Label", key: "label", render: formatNullableText },
      { label: "Description", key: "description", render: RenderEllipsisText },
      {
        label: "Owner",
        key: "owner",
        render: (owner: User) =>
          RenderUser(`${owner.firstName} ${owner.lastName}`, owner.avatar),
        width: 120,
      },
      {
        label: "Members",
        key: "users",
        render: RenderUserStack,
        width: 180,
      },
      { label: "Meeting date", key: "meetingTime", render: formatDateTime },
      { label: "Created at", key: "createdAt", render: formatDateTime },
    ],
    datasource: LunchGroupController.getList,
  };
}
