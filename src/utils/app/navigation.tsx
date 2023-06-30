import { generateUUID } from "../generator/uuid";

const userStore = useUserStore();

export const MapNavigationItems = (navItems: any[]): any[] => {
  return navItems
    .map((item) => {
      const hasAccess = !item?.permissions?.length ? true : true;
      // : item.permissions
      //     .map((permissionKey: string | string[]) => {
      //       if (Array.isArray(permissionKey))
      //         return permissionKey.every((key) =>
      //           checkPermission(key, userStore?.permissions ?? {})
      //         );
      //       return checkPermission(
      //         permissionKey,
      //         userStore?.permissions ?? {}
      //       );
      //     })
      //     .some((computedPermission: boolean) => computedPermission === true);

      if (!hasAccess) return null;

      if (item.items) item.items = MapNavigationItems(item.items);
      return {
        ...item,
        key: generateUUID(),
      };
    })
    .filter((item) => item)
    .filter((item) => item?.condition?.(userStore) ?? true)
    .filter((item) => !item.items || item.items.length);
};
