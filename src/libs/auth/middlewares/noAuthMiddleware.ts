import { useUserStore } from "~/stores/user.store";

export const useNoAuthentication = () => {
  const userStore = useUserStore();
  if (userStore.accessToken) return `/`;
  return;
};
