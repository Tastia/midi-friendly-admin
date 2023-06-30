import { ComputedRef, Ref } from 'vue'
export type LayoutKey = "auth" | "default"
declare module "C:/DEV/Playground/Other/midi-friendly-admin/node_modules/.pnpm/nuxt@3.0.0_eslint@8.43.0+sass@1.63.6/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}