import { DecodedToken, GuardParams } from "../useMiddlewares";
import JwtDecode from "jwt-decode";
import { useUserStore } from "~/stores/user.store";

export const useAuthentication = async ({ to }: GuardParams) => {
  const userStore = useUserStore();
  if (!userStore.accessToken) {
    const refreshToken = localStorage.getItem("refreshToken");
    const decodedToken: DecodedToken | null = refreshToken
      ? JwtDecode(refreshToken as string)
      : null;

    if (
      !refreshToken ||
      (decodedToken && (decodedToken?.exp ?? 0) * 1000 < Date.now())
    )
      return `/auth/login${to.path && `?redirect=${to.path}`}`;
    else return `/auth/refresh${to.path && `?redirect=${to.path}`}`;
  }

  const decodedToken: DecodedToken = JwtDecode(userStore.accessToken as string);
  if (decodedToken?.exp < Date.now() / 1000) {
    if (userStore.rememberMe)
      return `/auth/unlock${to?.path && `?redirect=${to.path}`}`;
    else return `/auth/login${to?.path && `?redirect=${to.path}`}`;
  }

  return;
};
