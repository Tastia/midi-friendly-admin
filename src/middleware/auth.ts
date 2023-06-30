import JwtDecode from "jwt-decode";

export default defineNuxtRouteMiddleware((to, from) => {
  console.log("auth middleware");
  const userStore = useUserStore();
  if (!userStore.user) return navigateTo("/auth/login");

  const decodedToken = JwtDecode<{ exp: number }>(
    userStore.accessToken as string
  );

  if (decodedToken?.exp < Date.now() / 1000) {
    userStore.ClearUserSession();
    if (userStore.rememberMe)
      return navigateTo(`/auth/login${to?.path && `?redirect=${to.path}`}`);
    else return navigateTo(`/auth/login${to?.path && `?redirect=${to.path}`}`);
  }

  if (to.name?.toString().split(".")[0] === "admin" && !userStore.user.admin)
    return navigateTo("/");

  if (to.name?.toString().split(".")[0] === "organization") {
    if (!userStore.organizations.length) return navigateTo("/");
    else if (!userStore.activeOrganizationId)
      userStore.activeOrganizationId = userStore.organizations[0]._id;
  }
});
