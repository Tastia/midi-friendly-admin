import {
  useLoadingBar,
  useMessage,
  useDialog,
  useNotification,
} from "naive-ui";
import { useFormApi } from "@chronicstone/vue-sweettools";

declare module "#app" {
  interface NuxtApp {
    $formApi: ReturnType<typeof useFormApi>;
    $messageApi: ReturnType<typeof useMessage>;
    $loadingBarApi: ReturnType<typeof useLoadingBar>;
    $dialogApi: ReturnType<typeof useDialog>;
    $notificationApi: ReturnType<typeof useNotification>;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $appEntity: ReturnType<typeof useAppEntity>;
    $formApi: ReturnType<typeof useFormApi>;
    $messageApi: ReturnType<typeof useMessage>;
    $loadingBarApi: ReturnType<typeof useLoadingBar>;
    $dialogApi: ReturnType<typeof useDialog>;
    $notificationApi: ReturnType<typeof useNotification>;
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {};
