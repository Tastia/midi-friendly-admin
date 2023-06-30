import { AuthLoginData, AuthLoginDto } from "@/types/auth";

export const AuthController = {
  login: (authPayload: AuthLoginDto) =>
    ApiInstance.post<AuthLoginData>("/auth/admin/login", authPayload).then(
      (res) => res.data
    ),
};
