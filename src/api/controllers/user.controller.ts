import { FetchParams } from "@/components/Core/DataTable/types";
import {
  Invitation,
  CreateInvitationLinkDto,
  CreateInvitationEmailDto,
} from "@/types/invitation";
import { User } from "@/types/user";
import { ApiInstance } from "@/api/instance";

export const UserController = {
  getList: (params: FetchParams) =>
    ApiInstance.post<User[]>("/users/list", params).then(
      (response) => response.data
    ),

  getUsers: () =>
    ApiInstance.get<User[]>("/users").then((response) => response.data),

  getUserById: (userId: string) =>
    ApiInstance.get<User>(`/users/${userId}`).then((res) => res.data),

  getInvitations: () =>
    ApiInstance.get<Invitation[]>("/invitations").then((res) => res.data),

  createOpenInvitationLink: (data: CreateInvitationLinkDto) =>
    ApiInstance.post<string>(
      "/users/invitation/create-invitation-link",
      data
    ).then((res) => res.data),

  sendInvitationToUsers: (data: CreateInvitationEmailDto) =>
    ApiInstance.post<Invitation>(
      "/users/invitation/send-email-invitation",
      data
    ).then((res) => res.data),

  setAdminAccess: (userId: string, allowAccess: boolean) =>
    ApiInstance.post(`/users/set-admin-access`, { userId, allowAccess }).then(
      (res) => res.data
    ),

  deleteUser: (userId: string) =>
    ApiInstance.delete(`/users/${userId}`).then((res) => res.data),

  updateUser: (userId: string, data: Partial<User>) =>
    ApiInstance.put(`/users/${userId}`, data).then((res) => res.data),
};
