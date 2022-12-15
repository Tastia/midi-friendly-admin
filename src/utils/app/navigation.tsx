import { renderIcon } from "../vue/renderIcon";
import { NavigationMenuItem } from "~/types/_navitation";
import { RouterLink } from "vue-router";

export function mapNavigationItems(items: NavigationMenuItem[]) {
  return items.map((item) => ({
    ...item,
    ...(!item.type &&
      !item.children && {
        _label: item.label,
        label: () => (
          <RouterLink to={{ name: item.key }}>{item.label}</RouterLink>
        ),
      }),
    ...(item.icon && { icon: renderIcon(item.icon) }),
  }));
}
