<script setup lang="ts">
import { useMessage } from "naive-ui";
import { AuthLoginDto } from "@/types/auth";

definePageMeta({
  auth: false,
  layout: "auth",
});

const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore();
const messageApi = useMessage();

async function Authenticate(data: AuthLoginDto) {
  try {
    appStore.startLoading("Authenticating...");
    const authData = await AuthController.login(data);
    userStore.StoreAuthData(authData);
    messageApi.success(
      `Bienvenue, ${authData.account.firstName} ${authData.account.lastName}`
    );
    appStore.stopLoading();
    router.push("/");
  } catch (err) {
    appStore.stopLoading();
    console.error(err);
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-2xl font-bold">Log-in</h1>
    <p>
      To access midi friendly admin dashboard, please authenticate with your
      administrator account
    </p>
    <AuthLoginForm @on-submit="Authenticate" />
  </div>
</template>
