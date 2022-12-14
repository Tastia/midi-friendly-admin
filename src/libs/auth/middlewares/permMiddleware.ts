import { GuardParams } from "../useMiddlewares";
import { useReactifiedApi } from "~/composables/useReactifiedApi";
import { useUserStore } from "~/stores/user.store";

export const usePermission = ({ from, to }: GuardParams) => {
  const { messageApi } = useReactifiedApi();
  const userStore = useUserStore();
  const permissionKeys = (to?.meta?.permissions as string[]) ?? [];
  const hasAccess = true;

  // TODO: Implement permission checking

  if (!hasAccess) {
    messageApi?.error(`Access forbidden !`);
    return from?.fullPath ?? "/";
  } else return;
};
