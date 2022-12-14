import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", () => {
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const rememberMe = ref<boolean>(false);
  const user = ref<any>(null);

  return {
    accessToken,
    refreshToken,
    rememberMe,
    user,
  };
});
