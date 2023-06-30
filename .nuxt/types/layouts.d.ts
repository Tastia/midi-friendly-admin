import { ComputedRef, Ref } from 'vue'
export type LayoutKey = "auth" | "default"
declare module "/Users/cyprienthao/Documents/DEV/ORGANIZATIONS/TASTIA/apps/midi-friendly-admin/node_modules/.pnpm/nuxt@3.0.0_eslint@8.43.0_rollup@2.79.1_sass@1.63.6_typescript@5.0.4/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}