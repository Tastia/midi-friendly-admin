import { useNoAuthentication } from "~/libs/auth/middlewares/noAuthMiddleware";
import { usePartialAuth } from "~/libs/auth/middlewares/partialAuthMiddleware";
import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";
import { createRouter, createWebHistory } from "vue-router";
import { useReactifiedApi } from "~/composables/useReactifiedApi";
import { useAuthentication } from "~/libs/auth/middlewares/authMiddleware";
import { usePermission } from "~/libs/auth/middlewares/permMiddleware";
import { useMiddlewares } from "~/libs/auth/useMiddlewares";

const routes = setupLayouts(generatedRoutes);
const router = createRouter({
  routes,
  history: createWebHistory(),
});

const middlewares = [
  { key: "auth", guard: useAuthentication },
  { key: "permissions", guard: usePermission },
  { key: "noAuth", guard: useNoAuthentication },
  { key: "expiredAuth", guard: usePartialAuth },
];

router.beforeEach(useMiddlewares(middlewares as any));
router.afterEach(() => {
  const { loadingBarApi } = useReactifiedApi();
  loadingBarApi?.finish?.();
});

export default router;
