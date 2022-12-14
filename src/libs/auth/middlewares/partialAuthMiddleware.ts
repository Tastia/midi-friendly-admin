import { DecodedToken, GuardParams } from "../useMiddlewares";
import JwtDecode from "jwt-decode";
import { useUserStore } from "~/stores/user.store";

export const usePartialAuth = ({ to }: GuardParams) => {
  const userStore = useUserStore();
  if (!userStore.accessToken)
    return `/auth/login${to?.path && `?redirect=${to.path}`}`;
  const decodedToken: DecodedToken = JwtDecode(userStore.accessToken);
  if (decodedToken?.exp > Date.now() / 1000) return `/`;
  return;
};
