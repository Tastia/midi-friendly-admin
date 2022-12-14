import { createApp } from "vue";
import { createPinia } from "pinia";
import NaiveUI from "naive-ui";
import router from "./router";

import "virtual:windi.css";
import App from "./App.vue";

import * as TemplateFilters from "~/utils/format";

async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia();

  app.config.globalProperties.$filters = TemplateFilters;

  app.use(pinia);
  app.use(NaiveUI);
  app.use(router);

  await router.isReady();
  app.mount("#app");
}

bootstrap();

declare module "vue" {
  interface ComponentCustomProperties {
    $filters: typeof TemplateFilters;
  }
}
