import { mapNavigationItems } from "~/utils/app/navigation";

export function useNavigationMenu() {
  const route = useRoute();

  return computed(() =>
    mapNavigationItems(
      route.name?.toString().startsWith("admin")
        ? AdminnMenuItems
        : OrganizationMenuItems
    )
  );
}
