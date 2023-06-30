<script setup lang="ts">
import { NuxtLayout, NuxtPage } from "#components";
import { useFormApi } from "@chronicstone/vue-sweettools";
import {
  useDialog,
  useLoadingBar,
  useMessage,
  useNotification,
} from "naive-ui";

const appStore = useAppStore();

const nuxtApp = useNuxtApp();
const formApi = useFormApi();
const dialogApi = useDialog();
const loadingBarApi = useLoadingBar();
const messageApi = useMessage();
const notificationApi = useNotification();

nuxtApp.provide("formApi", formApi);
nuxtApp.provide("dialogApi", dialogApi);
nuxtApp.provide("loadingBarApi", loadingBarApi);
nuxtApp.provide("messageApi", messageApi);
nuxtApp.provide("notificationApi", notificationApi);
</script>

<template>
  <NSpin :show="appStore.isLoading">
    <template v-if="appStore.isLoadingMessage" #description>
      <span class="font-black text-primary">
        {{ appStore.isLoadingMessage }}
      </span>
    </template>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </NSpin>
</template>
