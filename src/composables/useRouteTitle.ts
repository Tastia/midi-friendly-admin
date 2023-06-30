export const useRouteTitle = () => {
  const route = useRoute();
  const routeTitle = computed(() => {
    const rootSlug = route.name?.toString()?.split(".")[0] ?? "";
    const item = NavMenuItems.find((item) => item.slug === rootSlug);
    return { label: item?.label ?? formatKey(rootSlug), icon: item?.icon };
  });

  return routeTitle;
};
