import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = "auth" | "no-auth"
declare module "C:/DEV/Playground/Other/midi-friendly-admin/node_modules/.pnpm/nuxt@3.0.0_eslint@8.43.0+sass@1.63.6/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}