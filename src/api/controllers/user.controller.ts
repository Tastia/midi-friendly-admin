import { User } from "~/types/user.types";
import { ApiInstance } from "./../instance";

export const UserController = {
  getUsers: () =>
    ApiInstance.get<User[]>("/users").then((response) => response.data),
};
