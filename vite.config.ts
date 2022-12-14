import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import WindiCSS from "vite-plugin-windicss";
import Pages from "vite-plugin-pages";
import Layouts from "vite-plugin-vue-layouts";
import PurgeIcons from "vite-plugin-purge-icons";
import Components from "unplugin-vue-components/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import VueJsx from "@vitejs/plugin-vue-jsx";
import Inspect from "vite-plugin-inspect";
import AutoImport from "unplugin-auto-import/vite";
import VueTypeImports from "vite-plugin-vue-type-imports";
import VueMacros from "unplugin-vue-macros/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  plugins: [
    VueMacros({
      plugins: {
        vue: Vue(),
        vueJsx: VueJsx(),
      },
    }),
    WindiCSS(),
    Pages({
      dirs: ["src/pages"],
    }),
    Layouts({
      layoutsDirs: "src/layouts",
      defaultLayout: "main",
    }),
    Inspect(),
    PurgeIcons(),
    Icons({
      autoInstall: true,
    }),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vue-i18n",
        "vue/macros",
        "@vueuse/head",
        "@vueuse/core",
      ],
      dts: "src/auto-imports.d.ts",
      dirs: [
        "src/composables",
        "src/composables/**",
        "src/stores",
        "src/libs",
        "src/utils",
        "src/config",
        "src/utils/*",
        "src/utils/**/*",
      ],
      vueTemplate: true,
    }),
    Components({
      dts: true,
      resolvers: [IconsResolver({ componentPrefix: "" })],
      dirs: ["src/components", "src/elements"],
    }),
    VueTypeImports(),
  ],
});
