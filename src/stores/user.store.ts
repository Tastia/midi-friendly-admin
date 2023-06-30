import { Organization } from "./../types/organization";
import { AuthLoginData } from "@/types/auth";
import { defineStore } from "pinia";
import { User } from "@/types/user";
import { Serializer, useStorage as useCStorage } from "@vueuse/core";
import { ObjectSerializer } from "@/utils/data/object";

export const useUserStore = defineStore("userStore", () => {
  const refreshToken = ref<string | null>();
  const rememberMe = ref<boolean>(false);

  const accessToken = useCStorage<string | null>(
    "refreshToken",
    null,
    sessionStorage
  );

  const organizations = useCStorage<Organization[]>(
    "organizations",
    [],
    sessionStorage
  );

  const activeOrganizationId = useCStorage<string | null>(
    "activeOrganizationId",
    null,
    sessionStorage
  );

  const user = useCStorage<User | null>("user", null, sessionStorage, {
    serializer: ObjectSerializer as Serializer<User>,
  });

  const activeOrganization = computed<Organization | null>(() => {
    if (!user.value) return null;
    return (
      organizations.value?.find(
        (org) => org._id === activeOrganizationId.value
      ) ?? null
    );
  });

  function StoreAuthData(data: AuthLoginData) {
    accessToken.value = data.accessToken;
    user.value = data.account;
    organizations.value = data.organizations ?? [];
    activeOrganizationId.value = data.organizations?.[0]?._id ?? null;
  }

  function ClearUserSession() {
    accessToken.value = null;
    user.value = null;
    organizations.value = [];
    activeOrganizationId.value = null;
  }

  return {
    accessToken,
    refreshToken,
    rememberMe,
    user,
    organizations,
    activeOrganization,
    activeOrganizationId,
    StoreAuthData,
    ClearUserSession,
  };
});
