import { computed } from "vue";
import { useRoute } from "vue-router";
import { NavigationMenuItem } from "~/types/_navitation";
import { formatKey } from "~/utils/format";

export const useRouteTitle = () => {
  const navMenuItems = useNavigationMenu();
  const route = useRoute();

  function findDeepActiveItem(
    items: (NavigationMenuItem & { _label?: string })[]
  ): any {
    return (
      items.find((item) =>
        item.key.includes(route.name?.toString() as string)
      ) ||
      items.map((item) =>
        item.children ? findDeepActiveItem(item.children) : null
      )
    );
  }

  return computed(() => {
    const item = findDeepActiveItem(navMenuItems.value as any);
    return {
      label: item?._label ?? formatKey(item?.key ?? ""),
      key: item.key,
    };
  });
};
