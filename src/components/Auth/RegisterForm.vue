<script setup lang="ts">
import { Form, FormSchema } from "@chronicstone/vue-sweetforms";
import { helpers, sameAs } from "@vuelidate/validators";
import {
  AuthEmailCredentials,
  AuthLoginDto,
  AuthProviderCredentials,
  AuthRegisterDto,
} from "@/types/auth";

const emit = defineEmits<{ (e: "onSubmit", data: AuthRegisterDto): void }>();

function SubmitFormData(
  type: AuthLoginDto["type"],
  data: Omit<AuthEmailCredentials, "type"> | Omit<AuthRegisterDto, "type">
) {
  emit("onSubmit", { type, ...data } as AuthRegisterDto);
}

const formSchema: FormSchema = {
  gridSize: 8,
  fieldSize: "8 md:4",
  fields: [
    {
      label: "Email address",
      key: "email",
      type: "text",
      size: 8,
      required: true,
    },
    { label: "First name", key: "firstName", type: "text", required: true },
    { label: "Last name", key: "lastName", type: "text", required: true },
    { label: "Password", key: "password", type: "password", required: true },
    {
      label: "Confirm password",
      key: "confirmPassword",
      type: "password",
      dependencies: ["password"],
      validators: (dependencies) => ({
        sameAs: helpers.withMessage(
          "Password & confirmation must be identical",
          sameAs(dependencies?.password)
        ),
      }),
    },
  ],
};
</script>

<template>
  <div class="flex flex-col">
    <Form
      :form-options="formSchema"
      @on-submit="SubmitFormData('email', $event)"
    >
      <template #actions="{ toggleSubmit }">
        <NButton
          class="w-full"
          size="large"
          secondary
          type="primary"
          @click="toggleSubmit"
          >REGISTER</NButton
        >
      </template>
    </Form>
    <NDivider>
      <span class="text-sm">OR</span>
    </NDivider>
    <div class="flex justify-center gap-4 items-center">
      <!-- <AuthProviderFacebook /> -->
      <AuthProviderGoogle @on-auth="SubmitFormData('google', $event)">
        S'enregistrer avec google
      </AuthProviderGoogle>
      <!-- <AuthProviderLinkedIn /> -->
    </div>
  </div>
</template>
