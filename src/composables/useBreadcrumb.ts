import { MenuItemSection } from "@/types/_navigation";

export const useBreadcrumb = () => {
  const route = useRoute();

  const JoinWithPrecedent = (slug: string) =>
    slug.split(".").reduce((acc: string[], cur: string) => {
      return !acc.length ? [cur] : [...acc, acc[acc.length - 1] + "." + cur];
    }, []);

  const breadcrumb = computed<
    { label: string; icon?: string; slug?: string }[]
  >(() => {
    if (!route.name) return [{ label: "Home", icon: "mdi-home" }];
    const slugs = JoinWithPrecedent(route?.name as string);
    const breadcrumbs: Array<{
      label: string;
      icon?: string;
      slug?: string;
    }> = [];
    let lookupItems = NavMenuItems;
    for (const slug of slugs) {
      let item = lookupItems?.find(
        (item) =>
          (item.slug && item.slug === slug) ||
          (!item.slug &&
            item.items?.length &&
            item?.items?.find((child) => (child as any).slug === slug))
      );
      if (!item?.slug)
        item = (item as any)?.items.find(
          (child: MenuItemSection) => child.slug === slug
        );
      if (item) {
        breadcrumbs.push({
          label: item.label as string,
          icon: item.icon,
          slug: item.slug,
        });
        lookupItems = item.items as MenuItemSection[];
      } else
        breadcrumbs.push({
          label: formatKey(slug.split(".").reverse()[0]),
          slug,
        });
    }
    return breadcrumbs;
  });

  return breadcrumb;
};
