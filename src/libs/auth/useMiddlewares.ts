import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationRaw,
} from "vue-router";
import { useReactifiedApi } from "~/composables/useReactifiedApi";

export interface GuardParams {
  from: RouteLocationNormalized;
  to: RouteLocationNormalized;
}

export type MiddlewareGuard = (
  params: GuardParams
) => Promise<RouteLocationRaw> | RouteLocationRaw;

export interface MiddlewareItem {
  key: string;
  guard: MiddlewareGuard;
}

export interface DecodedToken {
  exp: number;
  iat: number;
}

export const useMiddlewares =
  (middlewares: MiddlewareItem[]) =>
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const { loadingBarApi } = useReactifiedApi();
    if (!from || to.path !== from.path) loadingBarApi?.start();

    for (const { key, guard } of middlewares) {
      if (to?.meta?.[key]) {
        const guardOutput = await guard({ to, from });
        if (guardOutput) {
          if (guardOutput === from.fullPath) loadingBarApi?.finish();
          return next(guardOutput);
        }
      }
    }
    return next();
  };
