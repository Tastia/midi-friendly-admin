import { computed, ComputedRef } from "vue";

type Entity = "admin" | "organization";

export interface IsEntity {
  currentEntity: ComputedRef<Entity | undefined>;
  isAdmin: ComputedRef<boolean>;
  isOrganization: ComputedRef<boolean>;
}

export const useIsEntity: () => IsEntity = () => {
  const router = useRouter();

  const currentEntity = computed(
    () =>
      router.currentRoute.value?.name?.toString().split(".")[0] as
        | Entity
        | undefined
  );
  return {
    currentEntity,
    isAdmin: computed(
      () =>
        router.currentRoute.value?.name?.toString().split(".")[0] === "admin" ??
        false
    ),
    isOrganization: computed(
      () =>
        router.currentRoute.value?.name?.toString().split(".")[0] ===
          "organization" ?? false
    ),
  };
};
