import { UserController } from "~/api/controllers/user.controller";
import { DataTableSchema } from "~/components/Core/DataTable/types";
import { User } from "~/types/user.types";

export function UserTableSchema(): DataTableSchema<User> {
  return {
    remote: false,
    columns: [
      { label: "First name", key: "firstName" },
      { label: "Last name", key: "lastName" },
      { label: "Email", key: "credentials.email" },
      {
        label: "Credentials provider",
        key: "credentials.type",
        render: (value) => {
          console.log({ value });
          return formatKey(value);
        },
      },
    ],
    datasource: UserController.getUsers,
  };
}