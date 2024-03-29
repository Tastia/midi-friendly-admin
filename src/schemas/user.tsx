import { User } from "~/types/user";
import { RenderCredentialsType } from "./utils/renderer";
import { buildTableSchema } from "@chronicstone/vue-sweettools";

export function UserTableSchema(organizationId?: string) {
  return buildTableSchema<User>({
    remote: true,
    filters: [credentialProviderFilter("credentials.type")],
    searchQuery: ["firstName", "lastName", "credentials.email"],
    staticFilters: organizationId
      ? [
          {
            key: "organizations._id",
            value: organizationId,
            matchMode: "equals",
          },
        ]
      : [],
    columns: [
      { label: "First name", key: "firstName" },
      { label: "Last name", key: "lastName" },
      { label: "Email", key: "credentials.email" },
      {
        label: "Credentials provider",
        key: "credentials.type",
        render: RenderCredentialsType,
      },
    ],
    datasource: UserController.getList,
    columnFitMode: "fill",
    rowActions: [
      {
        tooltip: ({ rowData }) =>
          `${rowData.admin ? "Revoke" : "Give"} admin access`,
        icon: ({ rowData }) =>
          rowData.admin ? "tabler:lock-open-off" : "tabler:lock-open",
        action: ({ rowData, tableApi }) =>
          SetAdminAccess(rowData).then(
            (shouldRefresh) => shouldRefresh && tableApi.refreshData()
          ),
      },
      {
        tooltip: "Delete user",
        icon: "tabler:trash",
        action: ({ rowData, tableApi }) =>
          DeleteUser(rowData).then(
            (shouldRefresh) => shouldRefresh && tableApi.refreshData()
          ),
      },
    ],
  });
}

export async function SetAdminAccess(user: User) {
  try {
    const { $messageApi } = useNuxtApp();
    const proceed = await useConfirmDialog({
      type: "warning",
      title: `${user.admin ? "Revoke" : "Give"} admin access`,
      content: `Are you sure you want to ${
        user.admin ? "revoke" : "give"
      } admin access for ${user.firstName} ${user.lastName}?`,
    });

    if (!proceed) return false;

    await UserController.setAdminAccess(user._id, !user.admin);
    $messageApi.success(
      `Access ${user.admin ? "revoked" : "granted"} successfully`
    );
    return true;
  } catch (err) {
    console.error(err);
  }
}

export async function DeleteUser(user: User) {
  try {
    const { $messageApi } = useNuxtApp();
    const proceed = await useConfirmDialog({
      type: "error",
      title: "Delete user",
      content: `Are you sure you want to delete this user : ${user.firstName} ${user.lastName}?`,
    });

    if (!proceed) return false;

    await UserController.deleteUser(user._id);
    $messageApi.success("User deleted successfully");
    return true;
  } catch (err) {
    console.error(err);
  }
}
