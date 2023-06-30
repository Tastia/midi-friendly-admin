import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import PurgeIcons from "vite-plugin-purge-icons";
import VueTypeImports from "vite-plugin-vue-type-imports";

export default defineNuxtConfig({
  ssr: false,
  pages: true,
  srcDir: "src",
  imports: {
    dirs: [
      "stores",
      "config",
      "composables",
      "utils",
      "api/controllers",
      "api",
      "schemas",
      "schemas/utils",
    ],
  },
  alias: {
    "@/.": "./",
  },
  modules: ["@pinia/nuxt", "@vueuse/nuxt", "nuxt-windicss"],
  css: ["@/assets/styles/main.scss"],
  vite: {
    plugins: [
      Components({
        resolvers: [NaiveUiResolver(), IconsResolver({ componentPrefix: "i" })], // Automatically register all components in the `components` directory
      }),
      Icons({
        autoInstall: true,
      }),
      PurgeIcons(),
      VueTypeImports(),
    ],
  },
  runtimeConfig: {
    public: {
      // apiUrl: import.meta.env.VITE_API_URL,
      // gatewayUrl: import.meta.env.VITE_GATEWAY_URL
    },
  },
  app: {
    head: {
      title: "Admin | Midi friendly",
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      script: [{ src: "https://code.iconify.design/1/1.0.0/iconify.min.js" }],
    },
    pageTransition: { name: "slide-fade", mode: "out-in" },
  },
});
